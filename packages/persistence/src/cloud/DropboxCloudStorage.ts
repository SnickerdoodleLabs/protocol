import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  AxiosAjaxUtils,
  CryptoUtils,
  ICryptoUtilsType,
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

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: AxiosAjaxUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
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

  private generateAccessToken(): ResultAsync<string, never> {
    /* 
      Example Access Token
    */
    // const ACCESS_TOKEN =
    // "sl.BinIzHO07_ZXFzNiinfXfOcc-aEQ7s6FCBwNSax1oPCVIO8Jd4ztod-gaWeTJbbK7GroZzUNpS3n0jr8f9VJAVjfSbZg6oz3Xk0z5tTUYPfjN4ctdyG-J34wFR-qN5N3xVyCx1aUk0NZ";
    // return this._configProvider.getConfig().map((config) => {
    //   const url = "https://api.dropbox.com/oauth2/token?code&grant_type=authorization_code&redirect_uri&client_id=" + config.dropboxAppKey + "&client_secret=" + config.dropboxAppSecret;
    //   return this.ajaxUtils.get<ITokenResponse>(
    //     new URL(url as string),
    //   ).map((response) => {
    //     return response.access_token;
    //   });
    // })
    return okAsync("");
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

  public clear(): ResultAsync<void, PersistenceError> {
    // return errAsync(
    //   new PersistenceError("Error: DropBox clear() is not implemented yet"),
    // );

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
      .mapErr((e) => new PersistenceError("error clearing gcp", e));
  }

  public copy(): ResultAsync<void, PersistenceError> {
    return errAsync(
      new PersistenceError("Error: DropBox copy() is not implemented yet"),
    );
  }

  public pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox pollByPriority() is not implemented yet",
      ),
    );
  }

  public pollByStorageType(
    restored: Set<DataWalletBackupID>,
    recordKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox pollByStorageType() is not implemented yet",
      ),
    );
  }

  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const defaultInsightPlatformBaseUrl =
          config.defaultInsightPlatformBaseUrl;
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        const fileName = ParsedBackupFileName.fromHeader(
          backup.header,
        ).render();

        // New IP Function for returning Auth Token
        return this.insightPlatformRepo.getAuthToken(
          privateKey,
          defaultInsightPlatformBaseUrl,
          addr + "/" + fileName,
        );
      })
      .andThen((signedUrl) => {
        // if (signedUrl === typeof URLString) {
        return this.ajaxUtils
          .put<undefined>(new URL(signedUrl), JSON.stringify(backup), {
            headers: {
              "Content-Type": `multipart/form-data;`,
            },
          })
          .map(() => DataWalletBackupID(backup.header.hash));
        // }
      })
      .mapErr((e) => new PersistenceError("error putting backup", e));
  }

  public pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox pollBackups() is not implemented yet",
      ),
    );
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox fetchBackup() is not implemented yet",
      ),
    );
  }

  public fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox fetchBackup() is not implemented yet",
      ),
    );
    // return this.getWalletListing()
    //   .andThen((backupsDirectory) => {
    //     const files = backupsDirectory.items;
    //     if (files == undefined) {
    //       return okAsync([]);
    //     }
    //     if (files.length == 0) {
    //       return okAsync([]);
    //     }

    //     // Now iterate only through the found hashes
    //     return ResultUtils.combine(
    //       files
    //         .filter((file) => {
    //           return file.name.includes(backupHeader);
    //         })
    //         .map((file) => {
    //           return this.ajaxUtils.get<DataWalletBackup>(
    //             new URL(file.mediaLink as string),
    //           );
    //         }),
    //     );
    //   })
    //   .mapErr((e) => new PersistenceError("error fetching backup", e));
  }

  public getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return errAsync(
      new PersistenceError(
        "Error: DropBox getLatestBackup() is not implemented yet",
      ),
    );
  }

  protected getWalletListing(): ResultAsync<
    IGoogleWalletBackupDirectory,
    PersistenceError | AjaxError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      const defaultDropboxCloudBucket = config.defaultDropboxCloudBucket;
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      const dataWalletFolder =
        "https://dropbox.com/storage/v1/b/" +
        defaultDropboxCloudBucket +
        "/o?prefix=" +
        addr;
      return this.ajaxUtils.get<IGoogleWalletBackupDirectory>(
        new URL(dataWalletFolder),
      );
    });
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

  public render(): string {
    const sanitized = ParsedBackupFileName._sanitizeDataType(this.dataType);
    return `${this.priority}_${sanitized}_${this.timestamp}_${this.hash}_${this.isField}`;
  }

  public static fromHeader(
    header: DataWalletBackupHeader,
  ): ParsedBackupFileName {
    return new ParsedBackupFileName(
      header.priority,
      header.dataType,
      header.timestamp,
      header.hash,
      header.isField,
    );
  }

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

  private static _sanitizeDataType(dataType: StorageKey): string {
    return dataType.replace("_", "$");
  }

  private static _getDataType(raw: string): StorageKey {
    return raw.replace("$", "_") as StorageKey;
  }
}

interface ITokenResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
  scope: string;
  refresh_token: string;
  account_id: string;
  uid: string;
}
