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
  EDataStorageType,
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

  // #region Field Methods
  public getField<T>(
    fieldKey: EFieldKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.waitForFieldRestore(fieldKey).andThen(() => {
      return this.storageUtils
        .read<SerializedObject>(fieldKey)
        .andThen((raw) => {
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
    fieldKey: EFieldKey,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForFieldRestore(fieldKey),
      this.backupManagerProvider.getBackupManager(),
      Serializer.serialize(value).asyncAndThen((val) => {
        return okAsync(val);
      }),
    ]).andThen(([_key, backupManager, serializedValue]) => {
      return backupManager.updateField(fieldKey, serializedValue);
    });
  }
  // #endregion

  // #region Record Methods
  public getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.waitForRecordRestore(recordKey).andThen(() => {
      return this.volatileStorage
        .getObject<T>(recordKey, key)
        .map((x) => (x == null ? null : x.data));
    });
  }

  public getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode | undefined,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.waitForRecordRestore(recordKey).andThen(() => {
      return this.volatileStorage.getCursor<T>(
        recordKey,
        indexName,
        query,
        direction,
        mode,
      );
    });
  }

  public getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.waitForRecordRestore(recordKey).andThen(() => {
      return this.volatileStorage
        .getAll<T>(recordKey, indexName)
        .map((values) => {
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
    return this.waitForRecordRestore(recordKey).andThen(() => {
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
  ): ResultAsync<T[], PersistenceError> {
    return this.waitForRecordRestore(recordKey).andThen(() => {
      return this.volatileStorage.getAllKeys<T>(
        recordKey,
        indexName,
        query,
        count,
      );
    });
  }

  public updateRecord<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: T,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.backupManagerProvider.getBackupManager(),
      this.waitForUnlock(),
    ]).andThen(([backupManager]) => {
      // There is special handling for Account records, since they are
      // added (for unfortunate reasons) before the unlock is complete.
      if (recordKey == ERecordKey.ACCOUNT) {
        return this.volatileStorage
          .putObject(
            recordKey,
            new VolatileStorageMetadata<T>(value, UnixTimestamp(0)),
          )
          .andThen(() => {
            return this.waitForRecordRestore(recordKey).andThen(() => {
              return this.volatileStorage
                .getKey(recordKey, value)
                .andThen((key) => {
                  return this.volatileStorage.getObject(recordKey, key);
                })
                .andThen((found) => {
                  if (found!.lastUpdate == 0) {
                    return backupManager.addRecord(
                      recordKey,
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

      // For all other record types, we just add the record to the backup manager
      return this.waitForRecordRestore(recordKey).andThen(() => {
        return backupManager.addRecord(
          recordKey,
          new VolatileStorageMetadata<T>(value, this.timeUtils.getUnixNow()),
        );
      });
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
  // #endregion

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

  // #region Backup Management Methods
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

  protected currentPoll: ResultAsync<void, PersistenceError> | null = null;
  public pollBackups(): ResultAsync<void, PersistenceError> {
    // We should only be polling for backups once at a time; if we try to poll
    // multiple times in parallel notify the user and return the current poll
    if (this.currentPoll != null) {
      this.logUtils.warning(`Already polling for backups and restoring`);
      return this.currentPoll;
    }

    this.currentPoll = this.postBackups(true)
      .andThen(() => {
        this.logUtils.debug(`Polling for new backups for all types`);
        return this.backupManagerProvider
          .getBackupManager()
          .andThen((backupManager) => {
            return ResultUtils.combine([
              backupManager.getRestored(),
              this.contextProvider.getContext(),
            ]);
          })
          .andThen(([restored, context]) => {
            this.logUtils.debug(
              `There are already ${restored.length} backups of all types`,
            );
            // Convert to a list of DataBackupID
            const restoredIds = new Set(restored.map((x) => x.id));

            return this.cloudStorage
              .pollBackups(restoredIds)
              .andThen((newBackups) => {
                if (newBackups.length == 0) {
                  this.logUtils.debug(`No new backups found`);
                  return okAsync(undefined);
                }

                this.logUtils.debug(
                  `Found ${newBackups.length} backups to restore of all types`,
                );
                // We need to sort the backups, so that we restore them in the correct order.
                const sortedBackups = newBackups.sort((a, b) => {
                  return a.header.timestamp - b.header.timestamp;
                });

                let totalRestored = restoredIds.size;
                let backupsToRestoreCount = sortedBackups.length;

                // Backups are restored in order, so that the updates are applied in the right order
                return ResultUtils.executeSerially(
                  sortedBackups.map((backup) => {
                    return () => {
                      return this.restoreBackup(backup).map(() => {
                        context.publicEvents.onBackupRestored.next(
                          new BackupRestoreEvent(
                            backup.header.isField
                              ? EDataStorageType.Field
                              : EDataStorageType.Record,
                            backup.header.dataType,
                            backup.id,
                            backup.header.name,
                            ++totalRestored,
                            --backupsToRestoreCount,
                          ),
                        );
                      });
                    };
                  }),
                );
              });
          });
      })
      .map(() => {
        // Reset the current poll.
        this.currentPoll = null;
      });

    return this.currentPoll;
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
  // #endregion

  protected waitForRecordRestore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    let restore = this.ongoingRestores.get(recordKey);

    if (restore != null) {
      return restore;
    }

    this.logUtils.debug(
      `Beginning restoration of record backups for ${recordKey}`,
    );

    restore = ResultUtils.combine([
      this.backupManagerProvider.getBackupManager(),
      this.waitForUnlock(),
    ])
      .andThen(([backupManager]) => {
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

        this.logUtils.debug(
          `There are already ${restoredOfType.length} backups restored for ${recordKey}`,
        );

        // Convert to a list of DataBackupID
        const restoredIds = new Set(restored.map((x) => x.id));

        return this.cloudStorage
          .pollByStorageType(restoredIds, recordKey)
          .andThen((backupsToRestore) => {
            this.logUtils.debug(
              `Found ${backupsToRestore.length} backups to restore for ${recordKey}`,
            );

            // We need to sort the backups, so that we restore them in the correct order.
            const sortedBackups = backupsToRestore.sort((a, b) => {
              return a.header.timestamp - b.header.timestamp;
            });

            let totalRestored = restoredIds.size;
            let backupsToRestoreCount = sortedBackups.length;

            // executeSerially has wierd semantics; it takes a list of functions that return
            // resultAsync rather than the results themselves;
            // This actually makes a lot of sense since it has to control the start of the
            // execution
            return ResultUtils.executeSerially(
              sortedBackups.map((backup) => {
                return () => {
                  return this.restoreBackup(backup).map(() => {
                    context.publicEvents.onBackupRestored.next(
                      new BackupRestoreEvent(
                        EDataStorageType.Record,
                        recordKey,
                        backup.id,
                        backup.header.name,
                        ++totalRestored,
                        --backupsToRestoreCount,
                      ),
                    );
                  });
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

    this.logUtils.log(`Beginning restoration of field backup for ${fieldKey}`);
    restore = this.waitForUnlock()
      .andThen(() => {
        return this.cloudStorage.getLatestBackup(fieldKey);
      })
      .andThen((backup) => {
        if (backup == null) {
          this.logUtils.log(`No backup found for field ${fieldKey}`);
          return okAsync(undefined);
        }
        this.logUtils.debug(
          `Latest backup for field ${fieldKey} is ${backup.header.name}, restoring now`,
        );
        return this.restoreBackup(backup);
      })
      .map(() => {});

    // Add the restore to the ongoing restores
    this.ongoingRestores.set(fieldKey, restore);

    return restore;
  }
}
