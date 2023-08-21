/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ILogUtils,
  ITimeUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  VersionedObjectMigrator,
  VersionedObject,
  DataWalletBackup,
  VolatileStorageKey,
  EBackupPriority,
  PersistenceError,
  VolatileDataUpdate,
  EDataUpdateOpCode,
  DataWalletBackupID,
  RestoredBackup,
  VolatileStorageMetadata,
  FieldDataUpdate,
  UnixTimestamp,
  ERecordKey,
  EFieldKey,
  EBoolean,
  DataWalletBackupHeader,
  SerializedObject,
  JSONString,
  BackupError,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IChunkRendererFactory } from "@persistence/backup/IChunkRendererFactory.js";
import { FieldIndex } from "@persistence/local/index.js";
import {
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class BackupManager implements IBackupManager {
  private tableRenderers = new Map<ERecordKey, IChunkRenderer>();
  private fieldRenderers = new Map<EFieldKey, IChunkRenderer>();
  private fieldHistory: Map<string, number> = new Map();
  private renderedChunks = new Map<DataWalletBackupID, DataWalletBackup>();
  private migrators = new Map<
    ERecordKey,
    VersionedObjectMigrator<VersionedObject>
  >();

  public constructor(
    protected tables: VolatileTableIndex<VersionedObject>[],
    protected fields: FieldIndex[],
    protected cryptoUtils: ICryptoUtils,
    protected volatileStorage: IVolatileStorage,
    protected storageUtils: IStorageUtils,
    protected timeUtils: ITimeUtils,
    protected backupUtils: IBackupUtils,
    protected chunkRendererFactory: IChunkRendererFactory,
    protected schemaProvider: IVolatileStorageSchemaProvider,
    protected logUtils: ILogUtils,
  ) {
    this.buildChunkRenderers();
  }

  public reset(): ResultAsync<void, BackupError> {
    // Fresh chunk renderers
    this.buildChunkRenderers();
    return okAsync(undefined);
  }

  public addRecord<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.getKey(recordKey, value.data).andThen((key) => {
      return this._checkRecordUpdateRecency(
        recordKey,
        key,
        value.lastUpdate,
      ).andThen((valid) => {
        if (!valid) {
          return okAsync(undefined);
        }

        return this.volatileStorage.putObject(recordKey, value).andThen(() => {
          const tableRenderer = this.tableRenderers.get(recordKey);
          if (tableRenderer == null) {
            return okAsync(undefined);
          }

          return this.schemaProvider
            .getCurrentVersionForTable(recordKey)
            .andThen((version) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return tableRenderer
                .update(
                  new VolatileDataUpdate(
                    EDataUpdateOpCode.UPDATE,
                    key,
                    value.lastUpdate,
                    value.data,
                    version,
                  ),
                )
                .map((backup) => {
                  if (backup != null) {
                    this.renderedChunks.set(backup.header.hash, backup);
                  }
                  return undefined;
                });
            });
        });
      });
    });
  }

  public deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    const timestamp = this.timeUtils.getUnixNow();
    return this._checkRecordUpdateRecency(tableName, key, timestamp).andThen(
      (valid) => {
        if (!valid) {
          return okAsync(undefined);
        }
        return this.volatileStorage
          .getObject(tableName, key, true)
          .andThen((found) => {
            if (!found) {
              return okAsync(undefined);
            }

            found.deleted = EBoolean.TRUE;
            found.lastUpdate = timestamp;
            return this.volatileStorage
              .putObject(tableName, found)
              .andThen(() => {
                return this.schemaProvider
                  .getCurrentVersionForTable(tableName)
                  .andThen((version) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return this.tableRenderers
                      .get(tableName)!
                      .update(
                        new VolatileDataUpdate(
                          EDataUpdateOpCode.REMOVE,
                          key,
                          timestamp,
                          found.data,
                          version,
                        ),
                      )
                      .map((backup) => {
                        if (backup != null) {
                          this.renderedChunks.set(backup?.header.hash, backup);
                        }
                        return undefined;
                      });
                  });
              });
          });
      },
    );
  }

  public updateField(
    key: EFieldKey,
    value: SerializedObject,
    force = false,
  ): ResultAsync<void, PersistenceError> {
    const fieldRenderer = this.fieldRenderers.get(key);
    if (fieldRenderer == null) {
      return errAsync(
        new PersistenceError("no renderer available for field", key),
      );
    }

    return this.storageUtils
      .read<SerializedObject>(key)
      .andThen((current) => {
        // If we aren't forcing an update, and the current value is the same as the new value,
        // don't update the backup
        if (current?.data == value.data && !force) {
          return okAsync(null);
        }

        const timestamp = this.timeUtils.getUnixNow();
        this.fieldHistory.set(key, timestamp);

        return this.storageUtils
          .write<SerializedObject>(key, value)
          .andThen(() => {
            return fieldRenderer.update(
              new FieldDataUpdate(key, value, timestamp),
            );
          });
      })
      .map((backup) => {
        if (backup != null) {
          this.renderedChunks.set(backup.header.hash, backup);
        }
        return undefined;
      });
  }

  public restore(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this._wasRestored(backup.header.hash)
      .andThen((restored) => {
        if (restored) {
          this.logUtils.warning(
            `Attempted to restore already restored backup ${backup.header.name} for data type ${backup.header.dataType}, skipping.`,
          );
          return okAsync(undefined);
        }

        this.logUtils.debug(
          `Restoring backup ${backup.header.name} for data type ${backup.header.dataType}.`,
        );
        // The backup is either a field or a set of records
        if (backup.header.isField) {
          return this._restoreField(
            backup.header,
            backup.blob as FieldDataUpdate,
          );
        }
        return this._restoreRecords(
          backup.header,
          backup.blob as VolatileDataUpdate[],
        );
      })
      .andThen(() => {
        return this._addRestored(backup);
      });
  }

  private _restoreRecords(
    header: DataWalletBackupHeader,
    blob: VolatileDataUpdate[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      blob.map((update) => {
        return this._checkRecordUpdateRecency(
          header.dataType as ERecordKey,
          update.key,
          update.timestamp,
        ).andThen((valid) => {
          if (!valid) {
            return okAsync(undefined);
          }

          const metadata = new VolatileStorageMetadata<VersionedObject>(
            update.value,
            update.timestamp,
            update.operation == EDataUpdateOpCode.REMOVE
              ? EBoolean.TRUE
              : EBoolean.FALSE,
          );
          return this.volatileStorage.putObject(
            header.dataType as ERecordKey,
            metadata,
          );
        });
      }),
    ).map(() => {});
  }

  private _restoreField(
    header: DataWalletBackupHeader,
    blob: FieldDataUpdate,
  ): ResultAsync<void, PersistenceError> {
    if (
      !this.fieldHistory.has(header.dataType) ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.fieldHistory.get(header.dataType)! < blob.timestamp
    ) {
      this.fieldHistory.set(header.dataType, blob.timestamp);
      return this.storageUtils.write(header.dataType, blob.value);
    }
    return okAsync(undefined);
  }

  public getRendered(
    force = false,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return ResultUtils.combine(
      [...this.tableRenderers.values(), ...this.fieldRenderers.values()].map(
        (renderer) => {
          if (force) {
            return renderer.clear().map((chunk) => {
              if (chunk != null) {
                this.renderedChunks.set(chunk.header.hash, chunk);
              }
            });
          } else {
            return renderer.checkInterval().map((chunk) => {
              if (chunk != null) {
                this.renderedChunks.set(chunk.header.hash, chunk);
              }
            });
          }
        },
      ),
    ).andThen(() => {
      return okAsync(Array.from(this.renderedChunks.values()));
    });
  }

  public markRenderedChunkAsRestored(
    id: DataWalletBackupID,
  ): ResultAsync<void, PersistenceError> {
    if (!this.renderedChunks.has(id)) {
      return errAsync(
        new PersistenceError(
          `There is no backup with ID ${id} that was rendered, cannot mark it as restored.`,
          id,
        ),
      );
    }

    return this._addRestored(this.renderedChunks.get(id)!).map(() => {
      this.renderedChunks.delete(id);
    });
  }

  public getRestored(): ResultAsync<RestoredBackup[], PersistenceError> {
    return this.volatileStorage
      .getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS)
      .map((restored) => {
        return restored.map((vsm) => vsm.data);
      });
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<JSONString, PersistenceError> {
    return okAsync(ObjectUtils.serialize(backup.blob));
  }

  protected buildChunkRenderers(): void {
    this.tables.forEach((schema) => {
      if (schema.priority != EBackupPriority.DISABLED) {
        this.tableRenderers.set(
          schema.name,
          this.chunkRendererFactory.createChunkRenderer(schema),
        );
        this.migrators.set(schema.name, schema.migrator);
      }
    });
    this.fields.forEach((schema) => {
      this.fieldRenderers.set(
        schema.name,
        this.chunkRendererFactory.createChunkRenderer(schema),
      );
    });
  }

  private _checkRecordUpdateRecency<T extends VersionedObject>(
    tableName: ERecordKey,
    key: VolatileStorageKey | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<boolean, PersistenceError> {
    if (key == null) {
      return okAsync(true);
    }

    // Get the object out of storage.
    return this.volatileStorage
      .getObject<T>(tableName, key, true)
      .andThen((found) => {
        // Given that we passed it what should have been a valid key from getKey(), this
        // if may be perfunctory
        if (found == null) {
          return okAsync(true);
        }

        return okAsync(found.lastUpdate < timestamp);
      });
  }

  private _addRestored(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject(
      ERecordKey.RESTORED_BACKUPS,
      new VolatileStorageMetadata(
        new RestoredBackup(
          DataWalletBackupID(backup.header.hash),
          backup.header.dataType,
        ),
        this.timeUtils.getUnixNow(),
      ),
    );
  }

  private _wasRestored(
    id: DataWalletBackupID,
  ): ResultAsync<boolean, PersistenceError> {
    return this.volatileStorage
      .getObject<RestoredBackup>(ERecordKey.RESTORED_BACKUPS, id)
      .map((result) => {
        return result != null;
      });
  }
}
