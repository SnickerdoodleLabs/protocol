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
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
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
export class GoogleCloudStorage implements ICloudStorage {
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

  public pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
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
              const [hash, backupPriority] = this._parsePath(file.name);
              return (
                priority == backupPriority &&
                !restored.has(DataWalletBackupID(hash))
              );
            })
            .map((file) => {
              return this.ajaxUtils.get<DataWalletBackup>(
                new URL(file.mediaLink as string),
              );
            }),
        );
      })
      .mapErr((e) => new PersistenceError("error fetching backups", e));
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  public clear(): ResultAsync<void, PersistenceError> {
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
          addr,
        );
      })
      .mapErr((e) => new PersistenceError("error clearing gcp", e));
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

        return this._getFileName(backup.header).andThen((fileName) => {
          return this.insightPlatformRepo.getSignedUrl(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/" + fileName,
          );
        });
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
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const [hash, _priority] = this._parsePath(file.name);
              return !restored.has(DataWalletBackupID(hash));
            })
            .map((file) => {
              return this.ajaxUtils.get<DataWalletBackup>(
                new URL(file.mediaLink as string),
              );
            }),
        );
      })
      .mapErr((e) => new PersistenceError("error polling backups", e));
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
        if (files == undefined) {
          return okAsync([]);
        }
        if (files.length == 0) {
          return okAsync([]);
        }

        // Now iterate only through the found hashes
        return okAsync(
          files.map((file) => {
            return BackupFileName(file.name);
          }),
        );
      })
      .mapErr((e) => new PersistenceError("error listing file names", e));
  }

  public fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
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
              return file.name.includes(backupHeader);
            })
            .map((file) => {
              return this.ajaxUtils.get<DataWalletBackup>(
                new URL(file.mediaLink as string),
              );
            }),
        );
      })
      .mapErr((e) => new PersistenceError("error fetching backup", e));
  }

  protected getWalletListing(): ResultAsync<
    IGoogleWalletBackupDirectory,
    PersistenceError | AjaxError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      const defaultGoogleCloudBucket = config.defaultGoogleCloudBucket;
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      const dataWalletFolder =
        "https://storage.googleapis.com/storage/v1/b/" +
        defaultGoogleCloudBucket +
        "/o?prefix=" +
        addr;
      return this.ajaxUtils.get<IGoogleWalletBackupDirectory>(
        new URL(dataWalletFolder),
      );
    });
  }

  private _getFileName(
    header: DataWalletBackupHeader,
  ): ResultAsync<string, never> {
    return okAsync(`${header.priority}_${header.hash}`);
  }

  private _parsePath(path: string): [string, EBackupPriority] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const name = path.split(/[/ ]+/).pop()!;
    const delim = name.indexOf("_");
    const priority = Number.parseInt(
      name.substring(0, delim),
    ) as EBackupPriority;
    const hash = name.substring(delim + 1);
    return [hash, priority];
  }
}
