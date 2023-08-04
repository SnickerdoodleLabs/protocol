import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  AxiosAjaxUtils,
  CryptoUtils,
  ICryptoUtilsType,
  ILogUtilsType,
  ILogUtils,
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
  ERecordKey,
  VolatileStorageKey,
  AccessToken,
  AccessCode,
  RefreshToken,
} from "@snickerdoodlelabs/objects";
import {
  Dropbox,
  DropboxAuth,
  DropboxResponse,
  DropboxResponseError,
} from "dropbox";
import { inject, injectable } from "inversify";
import { Err, ok, okAsync, Result, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IDropboxFileBackup,
  IDropboxWalletBackupDirectory,
} from "@persistence/cloud/IDropboxBackup.js";
import {
  IGoogleFileBackup,
  IGoogleWalletBackupDirectory,
} from "@persistence/cloud/IGoogleBackup.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class DropboxCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, DataWalletBackup>();
  protected _lastRestore = 0;
  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;
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
  ) {
    console.log("Dropbox is Called in init!");
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });

    this.initialize();
  }

  public passAuthTokens(path: string, accessToken: AccessToken): void {
    this.dropboxFilePath = path;
    this.accessToken = accessToken;
  }

  public name(): ECloudStorageType {
    return ECloudStorageType.Dropbox;
  }

  private initialize(): void {
    return undefined;
  }

  // use /files/list_folder API
  protected getWalletListing(): ResultAsync<
    IDropboxFileBackup[],
    PersistenceError
  > {
    console.log("Inside Dropbox GetWalletListing");
    // accessToken
    // path
    // refreshToken
    // config dropboxAppKey
    // config dropboxAppSecret

    console.log("Access token: " + this.accessToken);
    console.log("file path: " + this.dropboxFilePath);

    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const dataWalletFolder =
          "https://api.dropboxapi.com/2/files/list_folder";

        const url = new URL(dataWalletFolder);
        const data = {
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_media_info: false,
          include_mounted_folders: true,
          include_non_downloadable_files: true,
          path: "/" + this.dropboxFilePath,
          recursive: false,
        };

        // return undefined;
        return this.ajaxUtils.post<IDropboxWalletBackupDirectory>(
          url,
          JSON.stringify(data),
          {
            headers: {
              Authorization: `Authorization: Bearer `,
              // + accessToken,
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .map((backupDirectory) => {
        if (backupDirectory.items == undefined) {
          return [];
        }
        return backupDirectory.items;
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
    console.log("Inside Dropbox putBackup");
    return this._configProvider
      .getConfig()
      .andThen((config) => {
        console.log("Access token: " + this.accessToken);
        console.log("file path: " + this.dropboxFilePath);
        // Returns a temporary link, just like GCP
        // SEE https://www.dropbox.com/developers/documentation/http/documentation#files-get_temporary_upload_link

        // dropbox post method
        //     curl -X POST https://content.dropboxapi.com/2/files/upload \
        // --header "Authorization: Bearer sl.Bjc6SJ1x0vcJkbXYLEdE3aYQ3DnZxOICZZ7lI-YAgHyBUTOptDlvPeSQ6JXGug9ZHv1HjTBUp_pyaMgFziNaHwNvD8nZUtNqrRq9kpQpxVFvJYepQCJ-lG33rDhOHOQXvrPWH2J6mdeI1Cmb02z2K_I" \
        // --header "Dropbox-API-Arg: {\"autorename\":false,\"mode\":\"add\",\"mute\":false,\"path\":\"/backups/sample.txt\",\"strict_conflict\":false}" \
        // --header "Content-Type: application/octet-stream" \
        // --data-binary “”

        //   const url = "https://content.dropboxapi.com/2/files/upload";
        //   const data = {
        //     autorename: true,
        //     mode: "add",
        //     mute: false,
        //     path: this.dropboxFilePath,
        //     strict_conflict: false,
        //   };
        //   console.log("Dropbox url: " + url);
        //   return this.ajaxUtils
        //     .post<undefined>(new URL(url), JSON.stringify(data), {
        //       headers: {
        //         Authorization: `Bearer ` + this.accessToken,
        //         "Dropbox-API-Arg": data,
        //         "Content-Type": `application/octet-stream;`,
        //       },
        //     })
        //     .map(() => DataWalletBackupID(backup.header.hash));
        // })
        // .mapErr((e) => new PersistenceError("error putting backup", e));

        const url =
          "https://api.dropboxapi.com/2/files/get_temporary_upload_link";
        const data = {
          commit_info: {
            autorename: true,
            mode: "add",
            mute: false,
            path: "/" + this.dropboxFilePath,
            strict_conflict: false,
          },
          duration: 3600,
        };
        console.log("Dropbox url: " + url);

        return this.ajaxUtils
          .post<undefined>(new URL(url), JSON.stringify(data), {
            headers: {
              Authorization: `Bearer ` + this.accessToken,
              "Content-Type": `application/json;`,
            },
          })
          .map(() => DataWalletBackupID(backup.header.hash));
      })
      .andThen((tempUploadUrl) => {
        // If Successful, it ALSO returns a content hash!

        console.log("Dropbox tempUploadUrl: " + tempUploadUrl);
        return this.ajaxUtils
          .post<undefined>(new URL(tempUploadUrl), JSON.stringify(backup), {
            headers: {
              "Content-Type": `application/octet-stream;`,
            },
          })
          .map(() => DataWalletBackupID(backup.header.hash));
      })
      .mapErr((e) => new PersistenceError("error putting backup", e));
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    console.log("Dropbox is Called in unlock!");

    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);

    // username/password or an auth token from the FF
    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  // use /files/delete_v2 API
  public clear(): ResultAsync<void, PersistenceError> {
    // we wont need account address, if we pass in the folder location in FF.
    const data = {
      path: this.dropboxFilePath,
    };
    const url = new URL("https://api.dropboxapi.com/2/files/delete_v2");

    // return undefined;
    return this.ajaxUtils
      .post<void>(url, JSON.stringify(data), {
        headers: {
          Authorization: `Authorization: Bearer ` + this.accessToken,
          "Content-Type": `application/json;`,
        },
      })
      .mapErr(() => {
        return new PersistenceError("Error clearing dropbox backups");
      });
  }

  public pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    console.log("Inside Dropbox Cloud Storage");

    console.log("Access token: " + this.accessToken);
    console.log("file path: " + this.dropboxFilePath);
    return okAsync([]);
    // return this.getWalletListing()
    //   .andThen((files) => {
    //     if (files.length == 0) {
    //       return okAsync([]);
    //     }

    //     // Now iterate only through the found hashes
    //     return ResultUtils.combine(
    //       files
    //         .filter((file) => {
    //           const parsed = ParsedBackupFileName.parse(file.name);
    //           if (parsed == null) {
    //             return false;
    //           }
    //           return !restored.has(DataWalletBackupID(parsed.hash));
    //         })
    //         .map((file) => {
    //           return this.getBackupFile(file);
    //         }),
    //     );
    //   })
    //   .mapErr((e) => new PersistenceError("error polling backups", e));
  }

  // uses getWalletListing response
  public fetchBackup(
    backupFileName: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    console.log("fetchBackup is called!");
    return okAsync([]);
    // return this.getWalletListing().andThen((files) => {
    //   if (files == undefined) {
    //     return okAsync([]);
    //   }
    //   if (files.length == 0) {
    //     return okAsync([]);
    //   }

    //   // Now iterate only through the found hashes
    //   return ResultUtils.combine(
    //     files
    //       .filter((file) => {
    //         return file.name.includes(backupFileName);
    //       })
    //       .map((file) => {
    //         // return file;
    //         return this.getBackupFile(file);
    //       }),
    //   );
    // });
  }

  protected getBackupFile(
    googleFile: IDropboxFileBackup,
  ): ResultAsync<DataWalletBackup, PersistenceError> {
    return this.ajaxUtils
      .get<DataWalletBackup>(new URL(googleFile.mediaLink))
      .map((untyped) => {
        // The data retrieved from Google is untyped, so we need to convert it to the real thing
        // so that the getters work
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
        return new PersistenceError(
          `Error fetching backup ${googleFile.name}`,
          e,
        );
      });
  }

  // use /backup API
  public getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    console.log("getLatestBackup is called!");

    console.log("Access token: " + this.accessToken);
    console.log("file path: " + this.dropboxFilePath);

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
    return okAsync([]);
    // return this.getWalletListing().andThen((files) => {
    //   if (files.length == 0) {
    //     return okAsync([]);
    //   }

    //   // Now iterate only through the found hashes
    //   return ResultUtils.combine(
    //     files
    //       .filter((file) => {
    //         const parsed = ParsedBackupFileName.parse(file.name);
    //         if (parsed == null) {
    //           return false;
    //         }

    //         return (
    //           storageKey == parsed.dataType &&
    //           !restored.has(DataWalletBackupID(parsed.hash))
    //         );
    //       })
    //       .map((file) => {
    //         return this.getBackupFile(file);
    //       }),
    //   );
    // });
  }

  // file name is passed in, add it to path to get the directory
  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    console.log("listFileNames is called!");

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

  // use /oauth2/token API for getting access token
  // we need to relegrate the redirect within the form factor - core expects cloud storage to be available immediately
  // migrate this to form factor
  // could look into setting up an event to complete this - redirect may lose core
  /* 2 SCENARIOS: 
    1. We already have a refresh token, so we can access the access token. 
    2. We need to go through the entire auth process - ugh. 
  */

  // private generateAccessToken(): ResultAsync<AccessToken, AjaxError | AccessTokenError> {

  //   return ResultUtils.combine([
  //     this._configProvider.getConfig()
  //   ]).andThen(([config]) => {
  //     if (this.refreshToken !== "") {
  //       const url = new URL("https://api.dropbox.com/oauth2/token?grant_type=refresh_token&refresh_token=" + this.refreshToken + "&client_id=" + config.dropboxAppKey + "&client_secret=" + config.dropboxAppSecret);
  //       // return okAsync(AccessToken(""));
  //       return this.ajaxUtils.post<RefreshTokenResponse>(url)
  //         .map((refreshResponse) => {
  //           return (refreshResponse.access_token);
  //         })
  //     }

  //     // No refresh token means we need to do the entire auth process
  //     const url = new URL("https://www.dropbox.com/oauth2/authorize?client_id=" + config.dropboxAppKey + "&token_access_type=offline&response_type=code");
  //     return this.ajaxUtils.get<IAuthResponse>(url).andThen((webpage) => {
  //       const accessUrl = new URL("https://api.dropboxapi.com/oauth2/token?code=" + webpage.access_code + "&grant_type=authorization_code&client_id=" + config.dropboxAppKey + "&client_secret=" + config.dropboxAppSecret);
  //       return this.ajaxUtils.post<ITokenResponse>(accessUrl)
  //         .map((refreshResponse) => {
  //           return (refreshResponse.access_token);
  //         })
  //     });
  //   });
  // }

  public copy(): ResultAsync<void, PersistenceError> {
    return errAsync(
      new PersistenceError("Error: DropBox copy() is not implemented yet"),
    );
  }
}

class DropboxConnection {
  public constructor(public accessToken: AccessToken) {}
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

interface IAuthResponse {
  access_code: AccessCode;
  // expires_in: string;
  // token_type: string;
  // scope: string;
  // refresh_token: string;
  // account_id: string;
  // uid: string;
}

interface RefreshTokenResponse {
  access_token: AccessToken;
  token_type: string;
  expires_in: number;
}
