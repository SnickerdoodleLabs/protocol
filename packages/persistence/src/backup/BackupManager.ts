import {
  ICryptoUtils,
  ICryptoUtilsType,
  ITimeUtils,
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
  Signature,
  EVMAccountAddress,
  RestoredBackupMigrator,
  AESKey,
  InitializationVector,
  EncryptedString,
  ERecordKey,
  EFieldKey,
  EBoolean,
  JSONString,
  DataWalletBackupHeader,
  SerializedObject,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ChunkRenderer } from "@persistence/backup/ChunkRenderer.js";
import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { FieldIndex, Serializer } from "@persistence/local/index.js";
import {
  IVolatileStorage,
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
  ) {
    tables.forEach((schema) => {
      if (schema.priority != EBackupPriority.DISABLED) {
        this.tableRenderers.set(
          schema.name,
          new ChunkRenderer(
            schema,
            enableEncryption,
            cryptoUtils,
            backupUtils,
            privateKey,
            timeUtils,
          ),
        );
        this.migrators.set(schema.name, schema.migrator);
      }
    });
    fields.forEach((schema) => {
      this.fieldRenderers.set(
        schema.name,
        new ChunkRenderer(
          schema,
          enableEncryption,
          cryptoUtils,
          backupUtils,
          privateKey,
          timeUtils,
        ),
      );
    });

    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
  }

  public addRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.getKey(tableName, value.data).andThen((key) => {
      return this._checkRecordUpdateRecency(
        tableName,
        key,
        value.lastUpdate,
      ).andThen((valid) => {
        if (!valid) {
          return okAsync(undefined);
        }

        return this.volatileStorage.putObject(tableName, value).andThen(() => {
          if (!this.tableRenderers.has(tableName)) {
            return okAsync(undefined);
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.tableRenderers
            .get(tableName)!
            .update(
              new VolatileDataUpdate(
                EDataUpdateOpCode.UPDATE,
                key,
                value.lastUpdate,
                value.data,
                value.data.getVersion(),
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
  }

  public deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    const timestamp = Date.now();
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this.tableRenderers
                  .get(tableName)!
                  .update(
                    new VolatileDataUpdate(
                      EDataUpdateOpCode.REMOVE,
                      key,
                      timestamp,
                      found.data,
                      found.version,
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
    value: object,
  ): ResultAsync<void, PersistenceError> {
    if (!this.fieldRenderers.has(key)) {
      return errAsync(
        new PersistenceError("no renderer available for field", key),
      );
    }

    return ResultUtils.combine([
      this.storageUtils.read<SerializedObject>(key),
      Serializer.serialize(value),
    ]).andThen(([current, newValue]) => {
      if (current?.data == newValue.data) {
        return okAsync(undefined);
      }

      const timestamp = Date.now();
      this.fieldHistory.set(key, timestamp);

      return this.storageUtils
        .write<SerializedObject>(key, newValue)
        .andThen(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.fieldRenderers
            .get(key)!
            .update(new FieldDataUpdate(key, newValue, timestamp))
            .map((backup) => {
              if (backup != null) {
                this.renderedChunks.set(backup.header.hash, backup);
              }
              return undefined;
            });
        });
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
    ).map(() => undefined);
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

  public getRendered(): ResultAsync<DataWalletBackup[], PersistenceError> {
    return okAsync(Array.from(this.renderedChunks.values()));
  }

  public popRendered(
    id: DataWalletBackupID,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    if (!this.renderedChunks.has(id)) {
      return errAsync(
        new PersistenceError("no backup with that id in map", id),
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._addRestored(this.renderedChunks.get(id)!).map(() => {
      this.renderedChunks.delete(id);
      return id;
    });
  }

  public getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError> {
    return this.volatileStorage
      .getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS)
      .map((restored) => {
        return new Set(restored.map((x) => x.data.id));
      });
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._unpackBlob(backup.blob).andThen((backupBlob) => {
      return okAsync(JSON.stringify(backupBlob));
    });
  }

  private _checkRecordUpdateRecency<T extends VersionedObject>(
    tableName: ERecordKey,
    key: VolatileStorageKey | null,
    timestamp: number,
  ): ResultAsync<boolean, PersistenceError> {
    if (key == null) {
      return okAsync(true);
    }

    return this.volatileStorage
      .getObject<T>(tableName, key, true)
      .andThen((found) => {
        if (found == null) {
          return okAsync(true);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return okAsync(found!.lastUpdate < timestamp);
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
        return JSON.parse(unencrypted) as BackupBlob;
      });
  }

  private _addRestored(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject(
      ERecordKey.RESTORED_BACKUPS,
      new VolatileStorageMetadata(
        new RestoredBackup(DataWalletBackupID(backup.header.hash)),
        RestoredBackup.CURRENT_VERSION,
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
