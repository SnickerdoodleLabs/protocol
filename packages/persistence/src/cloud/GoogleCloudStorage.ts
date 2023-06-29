import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
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
  DataWalletBackupID,
  DataWalletBackupHeader,
  EBackupPriority,
  BackupFileName,
  StorageKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import { IGoogleWalletBackupDirectory } from "@persistence/cloud/IGoogleBackup.js";
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
    protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public pollByStorageType(
    restored: Set<DataWalletBackupID>,
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing().andThen((backupsDirectory) => {
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
            return this.ajaxUtils
              .get<DataWalletBackup>(new URL(file.mediaLink))
              .mapErr(
                (e) =>
                  new PersistenceError(`Error fetching backup ${file.name}`, e),
              );
          }),
      );
    });
  }

  public getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return this.getWalletListing().andThen((backupsDirectory) => {
      const files = backupsDirectory.items;
      if (files == undefined) {
        return okAsync(null);
      }
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

          if (parsedA.timestamp > parsedB.timestamp) {
            return 1;
          } else if (parsedA.timestamp < parsedB.timestamp) {
            return -1;
          }
          return 0;
        });

      if (sorted.length == 0) {
        return okAsync(null);
      }

      return this.ajaxUtils
        .get<DataWalletBackup>(new URL(sorted[0].mediaLink))
        .mapErr(
          (e) =>
            new PersistenceError(`Error fetching backup ${sorted[0].name}`, e),
        );
    });
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

        return this.insightPlatformRepo
          .getSignedUrl(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/" + backup.header.name,
          )
          .mapErr((e) => {
            return new PersistenceError(
              `Unable to retrieve a signed URL to post a backup from the insight platform. Backup named ${fileName}`,
              e,
            );
          })
          .andThen((signedUrl) => {
            return this.ajaxUtils
              .put<undefined>(new URL(signedUrl), JSON.stringify(backup), {
                headers: {
                  "Content-Type": `multipart/form-data;`,
                },
              })

              .mapErr((e) => {
                return new PersistenceError(
                  `Error posting backup to Google, name: ${backup.header.name}`,
                  e,
                );
              });
          });
      })
      .map(() => DataWalletBackupID(backup.header.hash));
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
              const parsed = ParsedBackupFileName.parse(file.name);
              if (parsed == null) {
                return false;
              }
              return !restored.has(DataWalletBackupID(parsed.hash));
            })
            .map((file) => {
              return this.ajaxUtils.get<DataWalletBackup>(
                new URL(file.mediaLink),
              );
            }),
        );
      })
      .mapErr((e) => new PersistenceError("error polling backups", e));
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.getWalletListing().map((backupsDirectory) => {
      const files = backupsDirectory.items;
      if (files == undefined) {
        return [];
      }
      if (files.length == 0) {
        return [];
      }

      // Now iterate only through the found hashes
      return files.map((file) => {
        return BackupFileName(file.name);
      });
    });
  }

  public fetchBackup(
    backupHeader: BackupFileName,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.getWalletListing().andThen((backupsDirectory) => {
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
            return this.ajaxUtils
              .get<DataWalletBackup>(new URL(file.mediaLink))
              .mapErr((e) => new PersistenceError("error fetching backup", e));
          }),
      );
    });
  }

  protected getWalletListing(): ResultAsync<
    IGoogleWalletBackupDirectory,
    PersistenceError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
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
      })
      .mapErr((e) => new PersistenceError("Error getting wallet listing", e));
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
