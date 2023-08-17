import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  PersistenceError,
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
  StorageKey,
  BackupRestoreEvent,
  EDataStorageType,
  BackupCreatedEvent,
  AuthenticatedStorageSettings,
  FieldDataUpdate,
  BackupError,
} from "@snickerdoodlelabs/objects";
import {
  IBackupManagerProvider,
  IBackupManagerProviderType,
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
  ICloudStorageManagerType,
  ICloudStorageManager,
  IBackupManager,
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDataWalletPersistence } from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  protected ongoingRestores: Map<
    StorageKey,
    ResultAsync<void, PersistenceError>
  > = new Map();

  public constructor(
    @inject(ICloudStorageManagerType)
    protected cloudStorageManager: ICloudStorageManager,
    @inject(IBackupManagerProviderType)
    protected backupManagerProvider: IBackupManagerProvider,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVolatileStorageSchemaProviderType)
    protected volatileSchemaProvider: IVolatileStorageSchemaProvider,
    @inject(IFieldSchemaProviderType)
    protected fieldSchemaProvider: IFieldSchemaProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  // #region Field Methods
  public getField<T>(
    fieldKey: EFieldKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.storageUtils.read<SerializedObject>(fieldKey).andThen((raw) => {
      if (raw == null) {
        return okAsync(null);
      }
      return Serializer.deserialize(raw).map((result) => {
        return result as T;
      });
    });
  }

  public getFieldFromAuthenticatedStorage<T>(
    fieldKey: EFieldKey,
  ): ResultAsync<T | null, PersistenceError> {
    return ResultUtils.combine([
      this.cloudStorageManager.getCloudStorage(),
      this.backupManagerProvider.getBackupManager(),
    ]).andThen(([cloudStorage, backupManager]) => {
      // Get the latest backup for the field, that's the only one that matters
      return cloudStorage.getLatestBackup(fieldKey).andThen((backup) => {
        if (backup == null) {
          return okAsync(null);
        }
        return backupManager
          .unpackBackupChunk(backup)
          .andThen((serializedFieldDataUpdate) => {
            const fieldDataUpdate = ObjectUtils.deserialize<FieldDataUpdate>(
              serializedFieldDataUpdate,
            );
            // If somehow the latest update is NOT for this field, return null
            if (fieldDataUpdate.key == fieldKey) {
              return Serializer.deserialize<T>(fieldDataUpdate.value);
            }
            this.logUtils.error(
              `Latest backup for field key ${fieldKey} actually has field key ${fieldDataUpdate.key}`,
            );
            return okAsync(null);
          });
      });
    });
  }

  public updateField(
    fieldKey: EFieldKey,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return this.updateFieldInternal(fieldKey, value, backupManager, false);
      });
  }
  // #endregion

  // #region Record Methods
  public getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.volatileStorage.getObject<T>(recordKey, key).map((x) => {
      return x == null ? null : x.data;
    });
  }

  public getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode | undefined,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.volatileStorage.getCursor<T>(
      recordKey,
      indexName,
      query,
      direction,
      mode,
    );
  }

  public getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileStorage
      .getAll<T>(recordKey, indexName)
      .map((values) => {
        return values.map((x) => x.data);
      });
  }

  public getAllByIndex<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName: string,
    query: IDBValidKey | IDBKeyRange,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileStorage
      .getAllByIndex<T>(recordKey, indexName, query)
      .map((values) => {
        return values.map((x) => x.data);
      });
  }

  // TODO: Fix this- it should return keys, not T!
  public getAllKeys<T>(
    recordKey: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileStorage.getAllKeys<T>(
      recordKey,
      indexName,
      query,
      count,
    );
  }

  public updateRecord<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: T,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return this.updateRecordInternal(recordKey, value, backupManager);
      });
  }

  public deleteRecord(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.deleteRecord(recordKey, key);
      });
  }
  // #endregion

  // #region Initialization
  public activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.cloudStorageManager.activateAuthenticatedStorage(settings);
  }

  public deactivateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.cloudStorageManager.deactivateAuthenticatedStorage(settings);
  }

  // #endregion

  // #region Backup Management Methods
  public dumpVolatileStorage(): ResultAsync<void, BackupError> {
    this.logUtils.warning(
      `Dumping everything in volatile storage into backups`,
    );
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        // We are going to reset the backup manager, so that new chunks will be generated
        return backupManager
          .reset()
          .andThen(() => {
            // We are going to loop over EFieldKey and ERecordKey, and get all of the data from them.
            return ResultUtils.combine(
              Object.values(EFieldKey).map((fieldKey) => {
                return this.getField<object>(fieldKey).andThen((fieldVal) => {
                  // No need to backup null fields
                  if (fieldVal == null) {
                    return okAsync(undefined);
                  }

                  // update
                  return this.updateFieldInternal(
                    fieldKey,
                    fieldVal,
                    backupManager,
                    true, // Force the backup, that's the whole point
                  );
                });
              }),
            );
          })
          .andThen(() => {
            // Done with fields, now do records
            return ResultUtils.combine(
              Object.values(ERecordKey).map((recordKey) => {
                return this.getAll(recordKey).andThen((records) => {
                  // Need to loop over all the records
                  return ResultUtils.combine(
                    records.map((record) => {
                      return this.updateRecordInternal(
                        recordKey,
                        record,
                        backupManager,
                      );
                    }),
                  );
                });
              }),
            );
          })
          .andThen(() => {
            // Now that the backup manager should have this huge set of backups, dump them to the cloud
            return this.postBackupsInternal(backupManager, true);
          });
      })
      .map(() => {})
      .mapErr((err) => {
        return new BackupError("Error while dumping volatile storage", err);
      });
  }

  public restoreBackup(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.restore(backup);
      })
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onBackupRestored.next(
          new BackupRestoreEvent(
            backup.header.isField
              ? EDataStorageType.Field
              : EDataStorageType.Record,
            backup.header.dataType,
            backup.id,
            backup.header.name,
            1,
            0,
          ),
        );
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

    this.currentPoll = ResultUtils.combine([
      this.postBackups(true),
      this.cloudStorageManager.getCloudStorage(),
    ])
      .andThen(([backups, cloudStorage]) => {
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
              `There are already ${restored.length} restored backups of all types`,
            );
            // Convert to a list of DataBackupID
            const restoredIds = new Set(restored.map((x) => x.id));
            return cloudStorage
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
                      return this.restoreBackupInternal(backup).map(
                        (success) => {
                          if (success) {
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
                          }
                        },
                      );
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
    return this.cloudStorageManager
      .getCloudStorage()
      .andThen((cloudStorage) => {
        return cloudStorage.fetchBackup(backupHeader);
      });
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.cloudStorageManager
      .getCloudStorage()
      .andThen((cloudStorage) => {
        return cloudStorage.listFileNames();
      });
  }

  public postBackups(
    force = false,
  ): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return this.postBackupsInternal(backupManager, force);
      });
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.cloudStorageManager
      .getCloudStorage()
      .andThen((cloudStorage) => {
        return cloudStorage.clear().mapErr((error) => {
          return new PersistenceError((error as Error).message, error);
        });
      });
  }
  // #endregion

  // #region Volatile Storage Methods
  public clearVolatileStorage(): ResultAsync<void, PersistenceError> {
    this.logUtils.warning("Clearing volatile storage");
    return ResultUtils.combine([
      this.volatileStorage.clear(),
      this.storageUtils.clear(),
    ]).map(() => {});
  }
  // #endregion

  protected waitForRecordRestore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    let restore = this.ongoingRestores.get(recordKey);

    if (restore != null) {
      return restore;
    }

    restore = this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        this.logUtils.debug(
          `Beginning restoration of record backups for ${recordKey}`,
        );

        return ResultUtils.combine([
          backupManager.getRestored(),
          this.contextProvider.getContext(),
          this.cloudStorageManager.getCloudStorage(),
        ]);
      })
      .andThen(([restored, context, cloudStorage]) => {
        // Sort the list of restored backups to only this type
        const restoredOfType = restored.filter((x) => {
          return x.storageKey == recordKey;
        });

        this.logUtils.debug(
          `There are already ${restoredOfType.length} backups restored for ${recordKey}`,
        );

        // Convert to a list of DataBackupID
        const restoredIds = new Set(restored.map((x) => x.id));

        return cloudStorage
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
                  return this.restoreBackupInternal(backup).map((success) => {
                    if (success) {
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
                    }
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
    restore = this.cloudStorageManager
      .getCloudStorage()
      .andThen((cloudStorage) => {
        return cloudStorage.getLatestBackup(fieldKey);
      })
      .andThen((backup) => {
        if (backup == null) {
          this.logUtils.log(`No backup found for field ${fieldKey}`);
          return okAsync(undefined);
        }
        this.logUtils.debug(
          `Latest backup for field ${fieldKey} is ${backup.header.name}, restoring now`,
        );
        return this.restoreBackupInternal(backup).andThen((success) => {
          // If the backup was not restored, we don't need to emit an event
          if (!success) {
            return okAsync(undefined);
          }
          return this.contextProvider.getContext().map((context) => {
            context.publicEvents.onBackupRestored.next(
              new BackupRestoreEvent(
                EDataStorageType.Field,
                fieldKey,
                backup.id,
                backup.header.name,
                1,
                0,
              ),
            );
          });
        });
      });

    // Add the restore to the ongoing restores
    this.ongoingRestores.set(fieldKey, restore);

    return restore;
  }

  protected updateFieldInternal(
    fieldKey: EFieldKey,
    value: object,
    backupManager: IBackupManager,
    forceBackup: boolean,
  ): ResultAsync<void, PersistenceError> {
    return Serializer.serialize(value).asyncAndThen((serializedValue) => {
      return backupManager.updateField(fieldKey, serializedValue, forceBackup);
    });
  }

  protected updateRecordInternal<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: T,
    backupManager: IBackupManager,
  ): ResultAsync<void, PersistenceError> {
    return backupManager.addRecord(
      recordKey,
      new VolatileStorageMetadata<T>(value, this.timeUtils.getUnixNow()),
    );
  }

  protected restoreBackupInternal(
    backup: DataWalletBackup,
  ): ResultAsync<boolean, never> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager
          .restore(backup)
          .map(() => {
            return true;
          })
          .orElse((err) => {
            this.logUtils.warning(
              `Error restoring backup ${backup.header.name}, Data wallet will likely have incomplete data!`,
              err,
            );
            return okAsync(false);
          });
      });
  }

  protected postBackupsInternal(
    backupManager: IBackupManager,
    force: boolean,
  ): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.cloudStorageManager
      .getCloudStorage()
      .andThen((cloudStorage) => {
        return backupManager.getRendered(force).andThen((backups) => {
          const postedBackupIds = new Array<DataWalletBackupID>();
          let backupsToCreateCount = backups.length;
          let totalBackupsCreated = 0;
          return ResultUtils.combine(
            backups.map((backup) => {
              return cloudStorage
                .putBackup(backup)
                .andThen((id) => {
                  return backupManager.markRenderedChunkAsRestored(id);
                })
                .andThen(() => {
                  return this.contextProvider.getContext();
                })
                .map((context) => {
                  context.publicEvents.onBackupCreated.next(
                    new BackupCreatedEvent(
                      backup.header.isField
                        ? EDataStorageType.Field
                        : EDataStorageType.Record,
                      backup.header.dataType,
                      backup.id,
                      backup.header.name,
                      --backupsToCreateCount,
                      ++totalBackupsCreated,
                    ),
                  );
                  postedBackupIds.push(backup.id);
                })
                .orElse((e) => {
                  this.logUtils.warning(
                    `Error placing backup ${backup.header.name} in cloud store`,
                    e,
                  );
                  return okAsync(undefined);
                });
            }),
          ).map(() => {
            return postedBackupIds;
          });
        });
      });
  }
}
