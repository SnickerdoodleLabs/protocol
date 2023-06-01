/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ITimeUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  DataWalletAddress,
  VersionedObjectMigrator,
  VersionedObject,
  DataWalletBackup,
  EVMPrivateKey,
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
  AESEncryptedString,
  BackupBlob,
  EVMAccountAddress,
  ERecordKey,
  EFieldKey,
  EBoolean,
  DataWalletBackupHeader,
  SerializedObject,
  JSONString,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IChunkRendererFactory } from "@persistence/backup/IChunkRendererFactory.js";
import { FieldIndex, Serializer } from "@persistence/local/index.js";
import {
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class BackupManager implements IBackupManager {
  private accountAddr: DataWalletAddress;
  private tableRenderers = new Map<ERecordKey, IChunkRenderer>();
  private fieldRenderers = new Map<EFieldKey, IChunkRenderer>();
  private fieldHistory: Map<string, number> = new Map();
  private renderedChunks = new Map<DataWalletBackupID, DataWalletBackup>();
  private migrators = new Map<
    ERecordKey,
    VersionedObjectMigrator<VersionedObject>
  >();

  public constructor(
    protected privateKey: EVMPrivateKey,
    tables: VolatileTableIndex<VersionedObject>[],
    fields: FieldIndex[],
    protected cryptoUtils: ICryptoUtils,
    protected volatileStorage: IVolatileStorage,
    protected storageUtils: IStorageUtils,
    protected enableEncryption: boolean,
    protected timeUtils: ITimeUtils,
    protected backupUtils: IBackupUtils,
    protected chunkRendererFactory: IChunkRendererFactory,
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {
    tables.forEach((schema) => {
      if (schema.priority != EBackupPriority.DISABLED) {
        this.tableRenderers.set(
          schema.name,
          this.chunkRendererFactory.createChunkRenderer(
            schema,
            enableEncryption,
            privateKey,
          ),
        );
        this.migrators.set(schema.name, schema.migrator);
      }
    });
    fields.forEach((schema) => {
      this.fieldRenderers.set(
        schema.name,
        this.chunkRendererFactory.createChunkRenderer(
          schema,
          enableEncryption,
          privateKey,
        ),
      );
    });

    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
  }

  public addRecord<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: T,
  ): ResultAsync<void, PersistenceError> {
    const timestamp = this.timeUtils.getUnixNow();
    return this._checkRecordUpdateRecency(
      recordKey,
      value.pKey,
      timestamp,
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
          .getMigratorForTable(recordKey)
          .andThen((migrator) => {
            const version = migrator.getCurrentVersion();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.tableRenderers
              .get(recordKey)!
              .update(
                new VolatileDataUpdate(
                  EDataUpdateOpCode.UPDATE,
                  value.pKey,
                  timestamp,
                  value,
                  version,
                ),
              )
              .map((backup) => {
                if (backup != null) {
                  this.renderedChunks.set(backup.header.hash, backup);
                }
                return undefined;
              });
          })
          .andThen(() => {
            if (value.pKey == null) {
              return okAsync(undefined);
            }

            return this._setMetadata(
              new VolatileStorageMetadata(
                recordKey,
                value.pKey,
                timestamp,
                EBoolean.FALSE,
              ),
            );
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

        return ResultUtils.combine([
          this._setMetadata(
            new VolatileStorageMetadata(
              tableName,
              key,
              timestamp,
              EBoolean.TRUE,
            ),
          ),
          this.volatileStorage.removeObject(tableName, key),
        ]).andThen(() => {
          return this.schemaProvider
            .getMigratorForTable(tableName)
            .andThen((migrator) => {
              const version = migrator.getCurrentVersion();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return this.tableRenderers
                .get(tableName)!
                .update(
                  new VolatileDataUpdate(
                    EDataUpdateOpCode.REMOVE,
                    key,
                    timestamp,
                    null,
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
      },
    );
  }

  public updateField(
    key: EFieldKey,
    value: unknown,
  ): ResultAsync<void, PersistenceError> {
    if (!this.fieldRenderers.has(key)) {
      return errAsync(
        new PersistenceError("no renderer available for field", key),
      );
    }

    return Serializer.serialize(value)
      .asyncAndThen((newValue) => {
        return this.storageUtils
          .read<SerializedObject>(key)
          .andThen((current) => {
            if (current?.data == newValue.data) {
              return okAsync(undefined);
            }

            const timestamp = this.timeUtils.getUnixNow();
            this.fieldHistory.set(key, timestamp);

            return this.storageUtils
              .write<SerializedObject>(key, newValue)
              .andThen(() => {
                return this.fieldRenderers
                  .get(key)!
                  .update(new FieldDataUpdate(key, newValue, timestamp));
              });
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
    return this._wasRestored(backup.header.hash).andThen((restored) => {
      if (restored) {
        return okAsync(undefined);
      }

      return this.backupUtils
        .verifyBackupSignature(backup, EVMAccountAddress(this.accountAddr))
        .andThen((valid) => {
          if (!valid) {
            return errAsync(
              new PersistenceError(
                "invalid signature for backup",
                backup.header.hash,
              ),
            );
          }
          return this._unpackBlob(backup.blob);
        })
        .andThen((unpacked) => {
          if (Array.isArray(unpacked)) {
            return this._restoreRecords(
              backup.header,
              unpacked as VolatileDataUpdate[],
            );
          }
          return this._restoreField(backup.header, unpacked as FieldDataUpdate);
        })
        .andThen(() => {
          return this._addRestored(backup);
        });
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

          switch (update.operation) {
            case EDataUpdateOpCode.UPDATE:
              return this._restoreRecordUpdate(header, update);
            case EDataUpdateOpCode.REMOVE:
              return this._restoreRecordDelete(header, update);
            default:
              return errAsync(
                new PersistenceError(
                  "invalid data update op code",
                  update.operation,
                ),
              );
          }
        });
      }),
    ).map(() => {});
  }

  private _restoreRecordUpdate(
    header: DataWalletBackupHeader,
    update: VolatileDataUpdate,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage
      .removeObject(header.dataType as ERecordKey, update.key!)
      .andThen(() => {
        return this._setMetadata(
          new VolatileStorageMetadata(
            header.dataType as ERecordKey,
            update.key!,
            update.timestamp,
            EBoolean.TRUE,
          ),
        );
      });
  }

  private _restoreRecordDelete(
    header: DataWalletBackupHeader,
    update: VolatileDataUpdate,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage
      .putObject(header.dataType as ERecordKey, update.value!)
      .andThen(() => {
        if (update.key == null) {
          return okAsync(undefined);
        }

        return this._setMetadata(
          new VolatileStorageMetadata(
            header.dataType as ERecordKey,
            update.key,
            update.timestamp,
            EBoolean.FALSE,
          ),
        );
      });
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
    force?: boolean,
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

  public popRendered(
    id: DataWalletBackupID,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    if (!this.renderedChunks.has(id)) {
      return errAsync(
        new PersistenceError("no backup with that id in map", id),
      );
    }

    return this._addRestored(this.renderedChunks.get(id)!).map(() => {
      this.renderedChunks.delete(id);
      return id;
    });
  }

  public getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError> {
    return this.volatileStorage
      .getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS)
      .map((restored) => {
        return new Set(restored.map((x) => x.id));
      });
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._unpackBlob(backup.blob).map((backupBlob) => {
      return ObjectUtils.serialize(backupBlob);
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

    return this._getMetadata(tableName, key).andThen((metadata) => {
      if (metadata == null) {
        return okAsync(true);
      }
      return okAsync(metadata.lastUpdate < timestamp);
    });
  }

  private _unpackBlob(
    blob: AESEncryptedString | BackupBlob,
  ): ResultAsync<BackupBlob, PersistenceError> {
    if (!this.enableEncryption) {
      return okAsync(blob as BackupBlob);
    }

    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(
          blob as AESEncryptedString,
          aesKey,
        );
      })
      .map((unencrypted) => {
        return ObjectUtils.deserialize<BackupBlob>(JSONString(unencrypted));
      });
  }

  private _addRestored(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject(
      ERecordKey.RESTORED_BACKUPS,
      new RestoredBackup(DataWalletBackupID(backup.header.hash)),
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

  private _setMetadata(
    metadata: VolatileStorageMetadata,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject<VolatileStorageMetadata>(
      ERecordKey.METADATA,
      metadata,
    );
  }

  private _getMetadata(
    recordKey: ERecordKey,
    primaryKey: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata | null, PersistenceError> {
    return this.volatileStorage.getObject<VolatileStorageMetadata>(
      ERecordKey.METADATA,
      VolatileStorageMetadata.getKey(recordKey, primaryKey),
    );
  }
}
