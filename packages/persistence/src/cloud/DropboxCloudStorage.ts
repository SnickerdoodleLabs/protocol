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
import { inject, injectable } from "inversify";
import { Err, ok, okAsync, Result, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
  
  private dropbox = new DropboxConnection(accessToken);

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
    const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    this.dropbox = new DropboxConnection(AccessToken);
  }

  private generateAuthToken(): string {
    const url = "https://api.dropboxapi.com/oauth2/token";
    return this.ajaxUtils.get<DataWalletBackup>(
      new URL(file.mediaLink as string),
    );
  }

  public readBeforeUnlock(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    const ACCESS_TOKEN = "";
    const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    // const file = dbx.;
    return okAsync(file);
  }

  // TODO
  public writeBeforeUnlock(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    const ACCESS_TOKEN = "";
    const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

    this.dropbox.filesUpload({contents: fileContent, path: fileName, mode:{".tag": "overwrite"}})

    return okAsync(undefined);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    // username/password or an auth token from the FF
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
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

  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    // return errAsync(
    //   new PersistenceError("Error: DropBox putBackup() is not implemented yet"),
    // );
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
        return this.insightPlatformRepo.getSignedUrl(
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
        "Error: DropBox listFileNames() is not implemented yet",
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
