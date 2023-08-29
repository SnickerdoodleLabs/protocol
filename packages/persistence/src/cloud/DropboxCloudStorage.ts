import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtilsType,
  ILogUtils,
  ITimeUtilsType,
  ITimeUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  EVMPrivateKey,
  DataWalletBackup,
  PersistenceError,
  DataWalletBackupID,
  DataWalletBackupHeader,
  BackupFileName,
  StorageKey,
  ECloudStorageType,
  AccessToken,
  RefreshToken,
  AuthenticatedStorageSettings,
  ParsedBackupFileName,
  UnixTimestamp,
  EExternalApi,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IDropboxFileBackup,
  IDropboxWalletBackupDirectory,
} from "@persistence/cloud/IDropboxBackup.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import {
  IPersistenceContextProviderType,
  IPersistenceContextProvider,
} from "@persistence/IPersistenceContextProvider.js";

@injectable()
export class DropboxCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, DataWalletBackup>();
  protected _lastRestore = 0;
  private _unlockPromise: Promise<EVMPrivateKey>;
  private _settingsPromise: Promise<AuthenticatedStorageSettings>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;
  private _resolveSettings:
    | ((credentials: AuthenticatedStorageSettings) => void)
    | null = null;
  protected dropboxFilePath = "";
  protected lastAuthTokenTimestamp: UnixTimestamp | null = null;
  protected currentAccessToken: AccessToken | null = null;
  protected refreshSeconds = 60 * 60 * 6; // 6 hours?

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IPersistenceContextProviderType)
    protected contextProvider: IPersistenceContextProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
    this._settingsPromise = new Promise<AuthenticatedStorageSettings>(
      (resolve) => {
        this._resolveSettings = resolve;
      },
    );
  }

  public name(): ECloudStorageType {
    return ECloudStorageType.Dropbox;
  }

  // use /file_requests/create API
  /* Same set up as GCP: we need a temporary link, then we use access token to upload */
  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    return ResultUtils.combine([this.waitForSettings(), this.getAccessToken()])
      .andThen(([settings, accessToken]) => {
        const url =
          "https://api.dropboxapi.com/2/files/get_temporary_upload_link";
        const commitData = {
          autorename: true,
          mode: "add",
          mute: false,
          path: settings.path + "/" + backup.header.name + ".txt",
          strict_conflict: false,
        };
        const data = {
          commit_info: commitData,
          duration: 3600,
        };
        return this.ajaxUtils
          .post<ITempUrl>(new URL(url), data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": `application/json`,
            },
          } as IRequestConfig)
          .mapErr((e) => {
            this.logUtils.error("error in getting temp url: " + e);
            return new PersistenceError("error getting temp url", e);
          });
      })
      .andThen((tempUploadUrl) => {
        // If Successful, it ALSO returns a content hash!
        return this.ajaxUtils
          .post<undefined>(
            new URL(tempUploadUrl.link),
            {
              header: backup.header,
              blob: backup.blob,
            },
            {
              headers: {
                "Content-Type": `application/octet-stream`,
              },
            },
          )
          .map(() => {
            return DataWalletBackupID(backup.header.hash);
          })
          .mapErr((e) => {
            this.logUtils.error("error in posting the backup: " + e);
            return new PersistenceError("error putting backup", e);
          });
      })
      .mapErr((e) => {
        this.logUtils.error("error in posting the backup: " + e);
        return new PersistenceError("error putting backup", e);
      });
  }

  public saveCredentials(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    this._resolveSettings!(settings);

    // username/password or an auth token from the FF
    return okAsync(undefined);
  }

  public clearCredentials(): ResultAsync<void, PersistenceError> {
    this._settingsPromise = new Promise<AuthenticatedStorageSettings>(
      (resolve) => {
        this._resolveSettings = resolve;
      },
    );

    // username/password or an auth token from the FF
    return okAsync(undefined);
  }

  /* 
    DELETES THE CONTENTS OF THE FOLDER, NOT THE FOLDER ITSELF!
  */
  public clear(): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForSettings(),
      this.getAccessToken(),
      this.contextProvider.getContext(),
    ]).andThen(([settingsData, accessToken, context]) => {
      const data = {
        path: settingsData.path,
      };
      const url = new URL("https://api.dropboxapi.com/2/files/delete_v2");

      context.privateEvents.onApiAccessed.next(EExternalApi.Dropbox);
      return this.ajaxUtils
        .post<void>(url, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `application/json`,
          },
        })
        .mapErr(() => {
          return new PersistenceError(
            "Error clearing dropbox folder - your folder may already be empty",
          );
        });
    });
  }

  public pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing()
      .andThen((files) => {
        if (files.length == 0) {
          return okAsync([]);
        }

        // Now iterate only through the found hashes
        return ResultUtils.combine(
          files
            .filter((file) => {
              const parsed = ParsedBackupFileName.parse(file.name);

              if (parsed == null) {
                return false;
              }
              return !restored.has(DataWalletBackupID(parsed.hash));
            })
            .map((file) => {
              return this.getBackupFile(file);
            }),
        );
      })
      .mapErr((e) => new PersistenceError("error polling backups", e));
  }

  // uses getWalletListing response
  public fetchBackup(
    backupFileName: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing().andThen((files) => {
      if (files == undefined) {
        return okAsync([]);
      }
      if (files.length == 0) {
        return okAsync([]);
      }

      // Now iterate only through the found hashes
      return ResultUtils.combine(
        files
          .filter((file) => {
            return file.name.includes(backupFileName);
          })
          .map((file) => {
            // return file;
            return this.getBackupFile(file);
          }),
      );
    });
  }

  // use /backup API
  public getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return this.getWalletListing().andThen((files) => {
      if (files.length == 0) {
        return okAsync(null);
      }

      // Find the latest backup based on the timestamp
      const sorted = files
        .filter((file) => {
          const parsed = ParsedBackupFileName.parse(file.name);
          if (parsed == null) {
            return false;
          }

          return storageKey == parsed.dataType;
        })
        .sort((a, b) => {
          const parsedA = ParsedBackupFileName.parse(a.name);
          const parsedB = ParsedBackupFileName.parse(b.name);
          if (parsedA == null || parsedB == null) {
            return 0;
          }

          // We want to sort in descending order
          return parsedB.timestamp - parsedA.timestamp;
        });

      if (sorted.length == 0) {
        return okAsync(null);
      }

      return this.getBackupFile(sorted[0]);
    });
  }

  /* Same set up as GCP */
  public pollByStorageType(
    restored: Set<DataWalletBackupID>,
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing().andThen((files) => {
      if (files.length == 0) {
        return okAsync([]);
      }

      // Now iterate only through the found hashes
      return ResultUtils.combine(
        files
          .filter((file) => {
            const parsed = ParsedBackupFileName.parse(file.name);
            if (parsed == null) {
              return false;
            }

            return (
              storageKey == parsed.dataType &&
              !restored.has(DataWalletBackupID(parsed.hash))
            );
          })
          .map((file) => {
            return this.getBackupFile(file);
          }),
      );
    });
  }

  // file name is passed in, add it to path to get the directory
  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.getWalletListing().map((files) => {
      if (files.length == 0) {
        return [];
      }

      // Now iterate only through the found hashes
      return files.map((file) => {
        return BackupFileName(file.name);
      });
    });
  }

  public copy(): ResultAsync<void, PersistenceError> {
    return errAsync(
      new PersistenceError("Error: DropBox copy() is not implemented yet"),
    );
  }

  protected waitForSettings(): ResultAsync<
    AuthenticatedStorageSettings,
    never
  > {
    return ResultAsync.fromSafePromise(this._settingsPromise);
  }

  protected getAccessToken(): ResultAsync<AccessToken, PersistenceError> {
    return this.waitForSettings().andThen((settings) => {
      // Check if the lastAuthTokenTimestamp is null, we need to get a new token immediately
      const now = this.timeUtils.getUnixNow();
      // console.log("settings.refreshToken: " + settings.refreshToken);
      const refreshToken = settings["refresh_token"];
      if (
        this.lastAuthTokenTimestamp == null ||
        this.currentAccessToken == null ||
        now - this.lastAuthTokenTimestamp > this.refreshSeconds
      ) {
        // Need to get a new access token
        return this.getNewAuthToken(refreshToken).map((accessToken) => {
          this.lastAuthTokenTimestamp = now;
          this.currentAccessToken = accessToken;
          return this.currentAccessToken;
        });
      }
      return okAsync(this.currentAccessToken);
    });
  }

  protected getNewAuthToken(
    refreshToken: RefreshToken,
  ): ResultAsync<AccessToken, PersistenceError> {
    // Do the work of trading the refresh token for a new access token
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const url = urlJoinP("https://api.dropbox.com/oauth2/token", [], {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: config.dropboxAppKey,
        client_secret: config.dropboxAppSecret,
      });

      context.privateEvents.onApiAccessed.next(EExternalApi.Dropbox);
      return this.ajaxUtils
        .post<{ access_token: AccessToken }>(new URL(url))
        .map((token) => {
          return token.access_token;
        })
        .mapErr((e) => {
          return new PersistenceError("Refresh Token Url failed", e);
        });
    });

    /*
https://api.dropbox.com/oauth2/token?grant_type=refresh_token&refresh_token=bu_D8O22yJoAAAAAAAAAARv0UYa36UaEyCSn23QepzTv-TDcfrbEVzHEOqfeDswa&client_id=w69949reoalc9xg&client_secret=78jch5z5o800dyw
    */
  }

  protected getBackupFile(
    dropboxFile: IDropboxFileBackup,
  ): ResultAsync<DataWalletBackup, PersistenceError> {
    return ResultUtils.combine([
      this.getAccessToken(),
      this.contextProvider.getContext(),
    ]).andThen(([accessToken, context]) => {
      const url = new URL("https://content.dropboxapi.com/2/files/download");
      const data = {
        path: dropboxFile.id,
      };
      const headerParams = {
        Authorization: `Bearer ${accessToken}`,
        "Dropbox-API-Arg": `${JSON.stringify(data)}`,
        "Content-Type": "text/plain",
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Dropbox);
      return this.ajaxUtils
        .post<DataWalletBackup>(url, undefined, {
          headers: headerParams,
        })
        .map((untyped) => {
          return new DataWalletBackup(
            new DataWalletBackupHeader(
              untyped.header.hash,
              untyped.header.timestamp,
              untyped.header.priority,
              untyped.header.dataType,
              untyped.header.isField,
            ),
            untyped.blob, // The blob doesn't need to be typed
          );
        })
        .mapErr((e) => {
          this.logUtils.error("Error: Get Backup File not working");
          return new PersistenceError(
            `Error fetching backup ${dropboxFile.name}`,
            e,
          );
        });
    });
  }

  // use /files/list_folder API
  protected getWalletListing(): ResultAsync<
    IDropboxFileBackup[],
    PersistenceError
  > {
    return ResultUtils.combine([this.waitForSettings(), this.getAccessToken()])
      .andThen(([settings, accessToken]) => {
        const dataWalletFolder =
          "https://api.dropboxapi.com/2/files/list_folder";
        const url = new URL(dataWalletFolder);
        const data = {
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_media_info: false,
          include_mounted_folders: true,
          include_non_downloadable_files: true,
          path: settings.path,
          recursive: false,
        };

        return this.ajaxUtils.post<IDropboxWalletBackupDirectory>(url, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `application/json`,
          },
        });
      })
      .map((backupDirectory) => {
        if (backupDirectory.entries == undefined) {
          return [];
        }
        return backupDirectory.entries;
      })
      .orElse((e) => {
        this.logUtils.error("Error getting wallet listing from Dropbox", e);
        return okAsync([]);
      });
  }
}

interface ITempUrl {
  link: string;
}
