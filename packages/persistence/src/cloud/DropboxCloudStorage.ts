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
  IGoogleFileBackup,
  IGoogleWalletBackupDirectory,
} from "@persistence/cloud/IGoogleBackup.js";
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
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;
  private refreshToken: RefreshToken = RefreshToken("");

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
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public type(): ECloudStorageType {
    return ECloudStorageType.Dropbox;
  }

  // use /oauth2/token API for getting access token
  private generateAccessToken(): ResultAsync<AccessToken, never> {
    return this._configProvider.getConfig().andThen((config) => {
      // If refresh token is available use that instead.
      // Going through auth again is very annoying
      if (this.refreshToken !== "") {

        const url = new URL("https://api.dropbox.com/oauth2/token?grant_type=refresh_token&refresh_token=" + this.refreshToken + "&client_id=" + config.dropboxAppKey + "&client_secret=" + config.dropboxAppSecret);

        return this.ajaxUtils.post<RefreshTokenResponse>(url).map((refreshResponse) => {
          return okAsync(AccessToken(""));

          return okAsync(refreshResponse.access_token);
        })
      }

      return okAsync(AccessToken(""));

      // No refresh token means we need to do the entire auth process
      // const url = new URL("https://www.dropbox.com/oauth2/authorize?client_id=" + config.dropboxAppKey + "&token_access_type=offline&response_type=code");
      // return this.ajaxUtils.get<IWebpageResponse>(url).map((webpage) => {
      //   return this.webpage.access_code;
      // })
    })
  }

  //   private generate(): ResultAsync<string, never> {

  //     if (this.refreshToken !== "") {

  //     }

  //     return this._configProvider.getConfig().map((config) => {
  //       const url = new URL("https://www.dropbox.com/oauth2/authorize?client_id=" + config.dropboxAppKey + "&token_access_type=offline&response_type=code");
  //       return this.ajaxUtils.get<unknown>(url).map((webpage) => {
  //       })
  //     })
  //   }

  //     return this.authenticationPage().
  // // Constructed Url for Authentication
  // return this._configProvider.getConfig().map((config) => {
  //   const url = new URL("https://www.dropbox.com/oauth2/authorize?client_id=" + config.dropboxAppKey + "&token_access_type=offline&response_type=code");

  //   return this.ajaxUtils.get<unknown>(url).map((webpage) => {

  //   })
  // })

  // return this._configProvider.getConfig().map((config) => {
  //   const url = "https://api.dropbox.com/oauth2/token?code&grant_type=authorization_code&redirect_uri&client_id=" + config.dropboxAppKey + "&client_secret=" + config.dropboxAppSecret;
  //   return this.ajaxUtils.get<ITokenResponse>(
  //     new URL(url as string),
  //   ).map((response) => {
  //     return response.access_token;
  //   });
  // })
  // return okAsync("");
  //   }

  // use /files/delete_v2 API
  public clear(): ResultAsync<void, PersistenceError> {
    // return errAsync(
    //   new PersistenceError("Error: DropBox clear() is not implemented yet"),
    // );

    // /delete path
    // curl - X POST https://api.dropboxapi.com/2/files/delete_v2 \
    // --header "Authorization: Bearer sl.Bi5YwnooveSw8cDoKCKRyJsck73nJVdLzKLsAepcFHzCxRmR8uw-3zq9w7ISMU8x7isOO5mG-tnNklR_ccSOtQSt79HAoNyHez9md5rM_p8Ke5tQuybUdeaeROLZ0P67DE8LFxXyKc6OhpVqHHs4jKw" \
    // --header "Content-Type: application/json" \
    // --data "{\"path\":\”/backups/demo\"}"

    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        return this.insightPlatformRepo.clearAllBackups(
          privateKey,
          config.defaultInsightPlatformBaseUrl,
          ECloudStorageType.Dropbox,
          addr,
        );
      })
      .mapErr((e) => new PersistenceError("error clearing dropbox backups", e));
  }

  // use /files/list_folder API
  protected getWalletListing(): ResultAsync<
    IDropboxFileBackup[],
    PersistenceError
  > {

    // curl -X POST https://api.dropboxapi.com/2/files/list_folder \
    // --header "Authorization: Basic dzY5OTQ5cmVvYWxjOXhnOjc4amNoNXo1bzgwMGR5dw==" \
    // --header "Content-Type: application/json" \
    // --data "{\"include_deleted\":false,\"include_has_explicit_shared_members\":false,\"include_media_info\":false,\"include_mounted_folders\":true,\"include_non_downloadable_files\":true,\"path\":\"/Homework/math\",\"recursive\":false}"

    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const defaultDropboxCloudBucket = config.defaultDropboxCloudBucket;
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);

        const dataWalletAddress =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);

        const dataWalletFolder =
          "https://dropbox.com/storage/v1/b/" +
          defaultDropboxCloudBucket +
          "/o?prefix=" +
          addr;

        return this.ajaxUtils.get<IDropboxWalletBackupDirectory>(
          new URL(dataWalletFolder),
        );
      })
      .map((backupDirectory) => {
        if (backupDirectory.items == undefined) {
          return [];
        }
        return backupDirectory.items;
      })
      .orElse((e) => {
        this.logUtils.error("Error getting wallet listing from Google", e);
        return okAsync([]);
      });
  }

  // uses getWalletListing response
  public fetchBackup(
    backupFileName: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {

    return this.getWalletListing().andThen((files) => {
      // return okAsync([]);

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

  // use /file_requests/create API
  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {

    // /create endpoing for putBackup
    // curl - X POST https://api.dropboxapi.com/2/file_requests/create \
    // --header "Authorization: Bearer sl.Bi5nybZoOPbijZnVNtAtQSOVtaqIGpgcMDIYPTvdzySMJhp-UAAOeQF15vy29z3yWCsTZgM7C0JanWc2UBHV_OLXE27PzeLBhJUG92odm64rMdE0hlV_506AtsDmh7sPzhZSS7P-3Rbd2pXG-HKBBVQ" \
    // --header "Content-Type: application/json" \
    // --data "{\"deadline\":{\"allow_late_uploads\":\"seven_days\",\"deadline\":\"2020-10-12T17:00:00Z\"},\"destination\":\"/File Requests/Homework\",\"open\":true,\"title\":\"Homework submission\"}"

    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const defaultInsightPlatformBaseUrl =
          config.defaultInsightPlatformBaseUrl;
        // const fileName = ParsedBackupFileName.fromHeader(
        //   backup.header,
        // ).render();
        const dataWalletAddress =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);


        const url = new URL("https://api.dropboxapi.com/2/file_requests/create");

        return this.ajaxUtils
          .post<undefined>(new URL(url), JSON.stringify(
            {
              "destination": "/backups/" + dataWalletAddress,
              "open": true,
              "title": "Homework submission"
            }), {
            headers: {
              "Content-Type": `multipart/form-data;`,
            },
          })

        // New IP Function for returning Auth Token
        return this.insightPlatformRepo.getAuthToken(
          privateKey,
          defaultInsightPlatformBaseUrl,
          addr + "/" + backup.header.name,
        );
      })
      .andThen((authToken) => {

        return this.ajaxUtils
          .put<undefined>(new URL(authToken), JSON.stringify(backup), {
            headers: {
              "Content-Type": `multipart/form-data;`,
            },
          })
          .map(() => DataWalletBackupID(backup.header.hash));
        // }
      })
      .mapErr((e) => new PersistenceError("error putting backup", e));
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
    })
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

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);

    // username/password or an auth token from the FF
    return okAsync(undefined);


    // return this._configProvider.getConfig().map((config) => {
    //   const authKey = config.dropboxAppKey;
    //   const authSecret = config.dropboxAppSecret;
    //   const authUrl =
    //     "https://www.dropbox.com/oauth2/authorize?client_id=" +
    //     authKey +
    //     "&response_type=code";
    //   return authUrl;
    // });
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }





  public copy(): ResultAsync<void, PersistenceError> {
    return errAsync(
      new PersistenceError("Error: DropBox copy() is not implemented yet"),
    );
  }



  public readBeforeUnlock(
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);


    // return this._configProvider.getConfig().map((config) => {
    //   config.
    // })

    // return this.generateAccessToken()
    //   .map((accessToken) => {
    //     const url = "https://api.dropboxapi.com/2/users/get_current_account";
    //     return this.ajaxUtils.post<unknown>(new URL(url), {
    //       headers: {
    //         "Content-Type": `multipart/form-data;`,
    //       },
    //     }).map((currentAccountData) => {

    //     })
    //   })
    //   .mapErr((e) => {
    //     return new errAsync(e);
    //   });
  }

  // TODO
  public writeBeforeUnlock(
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    // const ACCESS_TOKEN = "";
    // const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    // this.dropbox.filesUpload({contents: fileContent, path: fileName, mode:{".tag": "overwrite"}})

    return okAsync(undefined);
  }
}

class DropboxConnection {
  public constructor(public accessToken: AccessToken) { }
}

class ParsedBackupFileName {
  public constructor(
    public priority: EBackupPriority,
    public dataType: StorageKey,
    public timestamp: number,
    public hash: DataWalletBackupID,
    public isField: boolean,
  ) { }

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