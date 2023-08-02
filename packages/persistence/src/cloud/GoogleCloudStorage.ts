import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
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
  DataWalletBackupID,
  EBackupPriority,
  BackupFileName,
  StorageKey,
  DataWalletBackupHeader,
  ECloudStorageType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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
    protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public name(): string {
    return "Google Storage";
  }

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
              `Unable to retrieve a signed URL to post a backup from the insight platform. Backup named ${backup.header.name}`,
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

  public fetchBackup(
    backupFileName: BackupFileName,
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
            return this.getBackupFile(file);
          }),
      );
    });
  }

  protected getBackupFile(
    googleFile: IGoogleFileBackup,
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

  protected getWalletListing(): ResultAsync<
    IGoogleFileBackup[],
    PersistenceError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ])
      .andThen(([privateKey, config]) => {
        const defaultGoogleCloudBucket = config.defaultGoogleCloudBucket;

        // Unlock provides the data wallet private key, we need the actual account
        const dataWalletAddress =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);

        const dataWalletFolder = `https://storage.googleapis.com/storage/v1/b/${defaultGoogleCloudBucket}/o?prefix=${dataWalletAddress}`;

        return this.ajaxUtils.get<IGoogleWalletBackupDirectory>(
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
