import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  PersistenceError,
  EVMPrivateKey,
  DataWalletBackup,
  DataWalletBackupID,
  EBackupPriority,
  VolatileStorageKey,
  VersionedObject,
  VolatileStorageMetadata,
  BackupFileName,
  EFieldKey,
  ERecordKey,
  SerializedObject,
  UnixTimestamp,
  StorageKey,
  BackupRestoreEvent,
} from "@snickerdoodlelabs/objects";
import {
  IBackupManagerProvider,
  IBackupManagerProviderType,
  ICloudStorage,
  ICloudStorageType,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileStorage,
  IVolatileStorageType,
  IVolatileCursor,
  IVolatileStorageSchemaProviderType,
  IVolatileStorageSchemaProvider,
  IFieldSchemaProvider,
  IFieldSchemaProviderType,
  Serializer,
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDataWalletPersistence } from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  protected unlockPromise: Promise<EVMPrivateKey>;
  protected resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  protected ongoingRestores: Map<
    StorageKey,
    ResultAsync<void, PersistenceError>
  > = new Map();

  public constructor(
    @inject(IBackupManagerProviderType)
    protected backupManagerProvider: IBackupManagerProvider,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
    @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVolatileStorageSchemaProviderType)
    protected volatileSchemaProvider: IVolatileStorageSchemaProvider,
    @inject(IFieldSchemaProviderType)
    protected fieldSchemaProvider: IFieldSchemaProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
  }

  protected waitForRecordRestore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    let restore = this.ongoingRestores.get(recordKey);

    if (restore != null) {
      return restore;
    }

    this.logUtils.log(
      `Beginning restoration of record backups for ${recordKey}`,
    );

    restore = this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return ResultUtils.combine([
          backupManager.getRestored(),
          this.contextProvider.getContext(),
        ]);
      })
      .andThen(([restored, context]) => {
        // Sort the list of restored backups to only this type
        const restoredOfType = restored.filter((x) => {
          return x.storageKey == recordKey;
        });

        this.logUtils.log(
          `There are already ${restoredOfType.length} backups restored for ${recordKey}`,
        );

        // Convert to a list of DataBackupID
        const restoredIds = new Set(restored.map((x) => x.id));

        return this.cloudStorage
          .pollByStorageType(restoredIds, recordKey)
          .andThen((backupsToRestore) => {
            this.logUtils.log(
              `Found ${backupsToRestore.length} backups to restore for ${recordKey}`,
            );

            // We need to sort the backups, so that we restore them in the correct order.
            const sortedBackups = backupsToRestore.sort((a, b) => {
              return a.header.timestamp - b.header.timestamp;
            });

            // executeSerially has wierd semantics; it takes a list of functions that return
            // resultAsync rather than the results themselves;
            // This actually makes a lot of sense since it has to control the start of the
            // execution
            return ResultUtils.executeSerially(
              sortedBackups.map((backup) => {
                return () => {
                  return this.restoreBackup(backup).map(() => {
                    context.publicEvents.onBackupRestored.next(new BackupRestoreEvent(storageKey, backup.))
                  })
                };
              }),
            );
          });
      })
      .map(() => {});

    // Add the restore to the ongoing restores
    this.ongoingRestores.set(recordKey, restore);

    return restore;
  }

  protected waitForFieldRestore(
    fieldKey: EFieldKey,
  ): ResultAsync<void, PersistenceError> {
    let restore = this.ongoingRestores.get(fieldKey);

    if (restore != null) {
      return restore;
    }

    restore = this.cloudStorage
      .getLatestBackup(fieldKey)
      .andThen((backup) => {
        if (backup == null) {
          return okAsync(undefined);
        }
        return this.restoreBackup(backup);
      })
      .map(() => {});

    // Add the restore to the ongoing restores
    this.ongoingRestores.set(fieldKey, restore);

    return restore;
  }

  public getField<T>(key: EFieldKey): ResultAsync<T | null, PersistenceError> {
    return this.fieldSchemaProvider
      .getLocalStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(key)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.storageUtils.read<SerializedObject>(key).andThen((raw) => {
          if (raw == null) {
            return okAsync(null);
          }
          return Serializer.deserialize(raw).map((result) => {
            return result as T;
          });
        });
      });
  }

  public updateField(
    key: EFieldKey,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.backupManagerProvider.getBackupManager(),
    ]).andThen(([_key, backupManager]) => {
      return backupManager.updateField(key, value);
    });
  }

  public getObject<T extends VersionedObject>(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage
          .getObject<T>(name, key)
          .map((x) => (x == null ? null : x.data));
      });
  }

  public getCursor<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode | undefined,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getCursor<T>(
          name,
          indexName,
          query,
          direction,
          mode,
        );
      });
  }

  public getAll<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getAll<T>(name, indexName).map((values) => {
          return values.map((x) => x.data);
        });
      });
  }

  public getAllByIndex<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName: string,
    query: IDBValidKey | IDBKeyRange,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError> {
    return this.waitForPriority(priority).andThen(() => {
      return this.volatileStorage
        .getAllByIndex<T>(recordKey, indexName, query)
        .map((values) => {
          return values.map((x) => x.data);
        });
    });
  }

  public getAllKeys<T>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    count?: number | undefined,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(recordKey)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getAllKeys<T>(
          recordKey,
          indexName,
          query,
          count,
        );
      });
  }

  public updateRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: T,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.backupManagerProvider.getBackupManager(),
      this.waitForUnlock(),
    ]).andThen(([backupManager]) => {
      if (tableName == ERecordKey.ACCOUNT) {
        return this.volatileStorage
          .putObject(
            tableName,
            new VolatileStorageMetadata<T>(value, UnixTimestamp(0)),
          )
          .map(() => {
            this.waitForInitialRestore().andThen(() => {
              return this.volatileStorage
                .getKey(tableName, value)
                .andThen((key) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  return this.volatileStorage.getObject(tableName, key!);
                })
                .andThen((found) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  if (found!.lastUpdate == 0) {
                    return backupManager.addRecord(
                      tableName,
                      new VolatileStorageMetadata<T>(
                        value,
                        this.timeUtils.getUnixNow(),
                      ),
                    );
                  }
                  return okAsync(undefined);
                });
            });
          });
      }

      return backupManager.addRecord(
        tableName,
        new VolatileStorageMetadata<T>(value, this.timeUtils.getUnixNow()),
      );
    });
  }

  public deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.backupManagerProvider.getBackupManager(),
    ]).andThen(([_key, backupManager]) => {
      return backupManager.deleteRecord(tableName, key);
    });
  }

  public waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.cloudStorage.unlock(derivedKey),
      this.backupManagerProvider.unlock(derivedKey),
    ]).map(() => {
      // The derived key is stored in this result
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.resolveUnlock!(derivedKey);
    });
  }

  public restoreBackup(backup: DataWalletBackup): ResultAsync<void, never> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.restore(backup).orElse((err) => {
          this.logUtils.warning(
            `Error restoring backup ${backup.header.name}, Data wallet will likely have incomplete data!`,
            err,
          );
          return okAsync(undefined);
        });
      });
  }

  public pollBackups(): ResultAsync<void, PersistenceError> {
    return this.postBackups(true).andThen(() => {
      return this.backupManagerProvider
        .getBackupManager()
        .andThen((backupManager) => {
          return backupManager.getRestored();
        })
        .andThen((restored) => {
          return this.cloudStorage.pollBackups(restored);
        })
        .andThen((backups) => {
          return ResultUtils.combine(
            backups.map((backup) => {
              return this.restoreBackup(backup);
            }),
          );
        })
        .map(() => undefined);
    });
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.unpackBackupChunk(backup);
      });
  }

  public fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.cloudStorage.fetchBackup(backupHeader);
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.cloudStorage.listFileNames();
  }

  public postBackups(
    force?: boolean,
  ): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.getRendered(force).andThen((chunks) => {
          return ResultUtils.combine(
            chunks.map((chunk) => {
              return this.cloudStorage
                .putBackup(chunk)
                .andThen((id) => {
                  return backupManager.popRendered(id);
                })
                .orElse((e) => {
                  this.logUtils.debug("error placing backup in cloud store", e);
                  return okAsync(DataWalletBackupID(""));
                });
            }),
          ).map((ids) => {
            return ids.filter((id) => {
              return id != "";
            });
          });
        });
      })
      .mapErr((e) => new PersistenceError("error posting backups", e));
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.cloudStorage.clear().mapErr((error) => {
      return new PersistenceError((error as Error).message, error);
    });
  }
}
