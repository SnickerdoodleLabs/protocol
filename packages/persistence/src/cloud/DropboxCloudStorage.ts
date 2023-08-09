import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  AxiosAjaxUtils,
  CryptoUtils,
  ICryptoUtilsType,
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  EVMPrivateKey,
  DataWalletBackup,
  PersistenceError,
  AjaxError,
  DataWalletBackupID,
  DataWalletBackupHeader,
  EBackupPriority,
  BackupFileName,
  StorageKey,
  ECloudStorageType,
  AccessToken,
  AccessCode,
  RefreshToken,
  SerializedObject,
  EFieldKey,
  AuthenticatedStorageSettings,
  JSONString,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ok, err, Result, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IDropboxFileBackup,
  IDropboxWalletBackupDirectory,
} from "@persistence/cloud/IDropboxBackup.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class DropboxCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, DataWalletBackup>();
  protected _lastRestore = 0;
  private _unlockPromise: Promise<EVMPrivateKey>;
  private _credentialsPromise: Promise<AuthenticatedStorageSettings>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;
  private _resolveCredentials:
    | ((credentials: AuthenticatedStorageSettings) => void)
    | null = null;
  private refreshToken: RefreshToken = RefreshToken("");
  protected accessToken: AccessToken = AccessToken("");
  protected dropboxFilePath = "";

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: AxiosAjaxUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
    this._credentialsPromise = new Promise<AuthenticatedStorageSettings>(
      (resolve) => {
        this._resolveCredentials = resolve;
      },
    );
  }

  public name(): ECloudStorageType {
    return ECloudStorageType.Dropbox;
  }

  // use /files/list_folder API
  protected getWalletListing(): ResultAsync<
    IDropboxFileBackup[],
    PersistenceError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.waitForCredentials(),
    ])
      .andThen(([privateKey, params]) => {
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        const settingsData = params!;
        const dataWalletFolder =
          "https://api.dropboxapi.com/2/files/list_folder";

        const url = new URL(dataWalletFolder);
        const data = {
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_media_info: false,
          include_mounted_folders: true,
          include_non_downloadable_files: true,
          path: settingsData.path + "/" + addr,
          recursive: false,
        };

        // return undefined;
        return this.ajaxUtils.post<IDropboxWalletBackupDirectory>(url, data, {
          headers: {
            Authorization: `Bearer ${settingsData.accessToken}`,
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

  // use /file_requests/create API
  /* Same set up as GCP: we need a temporary link, then we use access token to upload */
  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
      this.waitForCredentials(),
    ])
      .andThen(([privateKey, config, params]) => {
        // Returns a temporary link, just like GCP
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        const settingsData = params!;
        const url =
          "https://api.dropboxapi.com/2/files/get_temporary_upload_link";
        const commitData = {
          autorename: true,
          mode: "add",
          mute: false,
          path:
            settingsData.path + "/" + addr + "/" + backup.header.name + ".txt",
          strict_conflict: false,
        };
        const data = {
          commit_info: commitData,
          duration: 3600,
        };

        return this.ajaxUtils
          .post<ITempUrl>(new URL(url), data, {
            headers: {
              Authorization: `Bearer ${settingsData.accessToken}`,
              "Content-Type": `application/json`,
            },
          } as IRequestConfig)
          .mapErr((e) => {
            this.logUtils.error("error in getting temp url: " + e);
            return new PersistenceError("error getting temp url", e);
          });
        // .map(() => DataWalletBackupID(backup.header.hash));
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

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);

    // username/password or an auth token from the FF
    return okAsync(undefined);
  }

  public saveCredentials(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveCredentials!(credentials);

    // username/password or an auth token from the FF
    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  protected waitForCredentials(): ResultAsync<
    AuthenticatedStorageSettings,
    never
  > {
    return ResultAsync.fromSafePromise(this._credentialsPromise);
  }

  /* 
    DELETES THE CONTENTS OF THE FOLDER, NOT THE FOLDER ITSELF!
  */
  public clear(): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.waitForCredentials(),
    ]).andThen(([privateKey, settingsData]) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      // const settingsData = params!;
      const data = {
        path: settingsData.path + "/" + addr,
      };
      const url = new URL("https://api.dropboxapi.com/2/files/delete_v2");

      // return undefined;
      return this.ajaxUtils
        .post<void>(url, data, {
          headers: {
            Authorization: `Bearer ${settingsData.accessToken}`,
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
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
      this.waitForCredentials(),
      this.getWalletListing(),
    ])
      .andThen(([privateKey, config, params, files]) => {
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        const settingsData = params!;
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

  protected getBackupFile(
    dropboxFile: IDropboxFileBackup,
  ): ResultAsync<DataWalletBackup, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.waitForCredentials(),
    ]).andThen(([privateKey, settingsData]) => {
      const url = new URL("https://content.dropboxapi.com/2/files/download");
      const data = {
        path: dropboxFile.id,
      };
      const headerParams = {
        Authorization: `Bearer ${settingsData.accessToken}`,
        "Dropbox-API-Arg": `${JSON.stringify(data)}`,
        "Content-Type": "text/plain",
      };
      return this.ajaxUtils
        .post<DataWalletBackup>(url, undefined, {
          headers: headerParams,
        })
        .map((untyped) => {
          return new DataWalletBackup(
            new DataWalletBackupHeader(
              untyped.header.hash,
              untyped.header.timestamp,
              untyped.header.signature,
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
}

class ParsedBackupFileName {
  public constructor(
    public priority: EBackupPriority,
    public dataType: StorageKey,
    public timestamp: number,
    public hash: DataWalletBackupID,
    public isField: boolean,
  ) {}

  public static parse(path: string): ParsedBackupFileName | null {
    const name = path.split(/[/ ]+/).pop();
    if (name == undefined) {
      return null;
    }

    const split = name.split("_");
    if (split.length != 5) {
      return null;
    }

    return new ParsedBackupFileName(
      Number.parseInt(split[0]) as EBackupPriority,
      ParsedBackupFileName._getDataType(split[1]),
      Number.parseInt(split[2]),
      split[3] as DataWalletBackupID,
      split[4] == "true",
    );
  }

  private static _getDataType(raw: string): StorageKey {
    return raw.replace("$", "_") as StorageKey;
  }
}

interface ITokenResponse {
  access_token: AccessToken;
  refresh_token: RefreshToken;

  expires_in: string;
  token_type: string;
  scope: string;
  account_id: string;
  uid: string;
}

interface RefreshTokenResponse {
  access_token: AccessToken;
  token_type: string;
  expires_in: number;
}

interface ITempUrl {
  link: string;
}

interface ISettingsData {
  type: string;
  path: string;
  accessToken: AccessToken;
}
