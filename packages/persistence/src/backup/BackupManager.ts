import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DataWalletAddress,
  VersionedObject,
  IDataWalletBackup,
  EVMPrivateKey,
  VolatileStorageKey,
  EBackupPriority,
  PersistenceError,
  DataWalletBackupID,
  RestoredBackup,
  VolatileStorageMetadata,
  AESEncryptedString,
  BackupBlob,
  Signature,
  EVMAccountAddress,
  RestoredBackupMigrator,
  AESKey,
  ERecordKey,
  LocalStorageKey,
  EFieldKey,
  EDataUpdateOpCode,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { render } from "react-dom";

import { ChunkRenderer } from "@persistence/backup/ChunkRenderer.js";
import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import {
  IVolatileStorage,
  IVolatileStorageType,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export type ChunkRenderMapKey = EFieldKey | EBackupPriority;

export class BackupManager implements IBackupManager {
  private accountAddr: DataWalletAddress;
  private numUpdates = 0;

  private schemas = new Map<string, VolatileTableIndex<VersionedObject>>();
  private fieldHistory: Map<string, number> = new Map();
  private deletionHistory: Map<VolatileStorageKey, number> = new Map();
  private chunkQueue: Array<IDataWalletBackup> = [];

  /*  
    For tracking Field and Update changes: 
    Fields: lump these in by their high priority vs low priority
    Tables: separate by their table keys
  */
  private chunkRenderingMap: Map<string, ChunkRenderer> = new Map();

  public constructor(
    protected privateKey: EVMPrivateKey,
    protected schema: VolatileTableIndex<VersionedObject>[],
    protected volatileStorage: IVolatileStorage,
    protected cryptoUtils: ICryptoUtils,
    protected storageUtils: IStorageUtils,
    public maxChunkSize: number,
    protected enableEncryption: boolean,
  ) {
    this.schema.forEach((schema) => {
      if (!schema.disableBackup) {
        this.schemas.set(schema.name, schema);
      }
    });

    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );

    this.schema.forEach((schema) => {
      this.chunkRenderingMap.set(
        schema.name,
        new ChunkRenderer(
          this.privateKey,
          schema,
          this.cryptoUtils,
          this.maxChunkSize,
          schema.name as EFieldKey,
          this.enableEncryption,
        ),
      );
    });
  }

  public clear(): ResultAsync<void, never> {
    this.numUpdates = 0;
    return okAsync(undefined);
  }

  public addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    if (!this.schemas.has(tableName)) {
      return this.volatileStorage.putObject<T>(tableName, value);
    }
    const renderer = this.chunkRenderingMap.get(tableName) as ChunkRenderer;
    return renderer
      .addRecord(tableName, value)
      .andThen((chunk) => {
        if (chunk == undefined) {
          return okAsync(undefined);
        }
        return okAsync(this.chunkQueue.push(chunk)).andThen(() => {
          this.numUpdates += 1;
          return this.volatileStorage.putObject<T>(tableName, value);
        });
      })
      .andThen(() => {
        return this._checkSize();
      });
  }

  public deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
    timestamp: number = Date.now(),
  ): ResultAsync<void, PersistenceError> {
    if (!this.schemas.has(tableName)) {
      return this.volatileStorage.removeObject(tableName, key);
    }
    const renderer = this.chunkRenderingMap.get(tableName) as ChunkRenderer;
    return renderer
      .deleteRecord(tableName, key, priority, timestamp)
      .andThen((chunk) => {
        if (chunk == undefined) {
          return okAsync(undefined);
        }
        this.deletionHistory.set(key, timestamp);
        return okAsync(this.chunkQueue.push(chunk)).andThen(() => {
          this.numUpdates += 1;
          return this.volatileStorage.removeObject(tableName, key);
        });
      })
      .andThen(() => {
        return this._checkSize();
      });
  }

  public updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    const renderer = this.chunkRenderingMap.get(key) as ChunkRenderer;
    const serialized = JSON.stringify(value);
    const timestamp = Date.now();
    this._updateFieldHistory(key, timestamp);

    return ResultUtils.combine([
      renderer.updateField(key, serialized, priority, timestamp),
      this.storageUtils.write(key, serialized),
    ]).andThen(() => {
      this.numUpdates += 1;
      this._updateFieldHistory(key, timestamp);
      return this._checkSize();
    });
  }

  public restore(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this._wasRestored(DataWalletBackupID(backup.header.hash)).andThen(
      (wasRestored) => {
        if (wasRestored) {
          return okAsync(undefined);
        }

        return this._verifyBackupSignature(backup).andThen((valid) => {
          if (!valid) {
            return errAsync(new PersistenceError("invalid backup signature"));
          }

          return this._unpackBlob(backup.blob)
            .andThen((unpacked) => {
              return ResultUtils.combine(
                Object.keys(unpacked.fields).map((fieldName) => {
                  const update = unpacked.fields[fieldName];
                  // return this.storageUtils.write(fieldName, update.value);
                  if (
                    !(fieldName in this.fieldHistory) ||
                    update.timestamp > this.fieldHistory[fieldName]
                  ) {
                    // if (this.fieldUpdates.hasOwnProperty(fieldName)) {
                    //   if (update.timestamp > this.fieldUpdates[fieldName][1]) {
                    //     this.fieldHistory[fieldName] = update.timestamp;
                    //     delete this.fieldUpdates[fieldName];
                    //     return this.storageUtils.write(fieldName, update.value);
                    //   }
                    // } else {
                      this.fieldHistory[fieldName] = update.timestamp;
                      return this.storageUtils.write(fieldName, update.value);
                    // }
                  }

                  return okAsync(undefined);
                }),
              ).andThen(() => {
                return ResultUtils.combine(
                  Object.keys(unpacked.records).map((tableName) => {
                    const table = unpacked.records[tableName];
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const migrator = this.schemas.get(tableName)!.migrator;

                    return ResultUtils.combine(
                      table.map((value) => {
                        switch (value.operation) {
                          case EDataUpdateOpCode.UPDATE:
                            const obj = migrator.getCurrent(
                              value.value as unknown as Record<string, unknown>,
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              value.version || 0,
                            );

                            return this.volatileStorage
                              .getKey(tableName, obj)
                              .andThen((key) => {
                                if (key == null) {
                                  return this.volatileStorage.putObject(
                                    tableName,
                                    new VolatileStorageMetadata(
                                      value.priority,
                                      obj,
                                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                      value.version!,
                                      value.timestamp,
                                    ),
                                  );
                                }

                                return this.volatileStorage
                                  .getObject(tableName, key)
                                  .andThen((found) => {
                                    if (
                                      (found != null &&
                                        found.lastUpdate > value.timestamp) ||
                                      (this.deletionHistory.has(key) &&
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        this.deletionHistory.get(key)! >
                                          value.timestamp)
                                    ) {
                                      return okAsync(undefined);
                                    }

                                    return this.volatileStorage.putObject(
                                      tableName,
                                      new VolatileStorageMetadata(
                                        value.priority,
                                        obj,
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        value.version!,
                                        value.timestamp,
                                      ),
                                    );
                                  });
                              });
                          case EDataUpdateOpCode.REMOVE:
                            return this.volatileStorage
                              .getObject(
                                tableName,
                                value.value as VolatileStorageKey,
                              )
                              .andThen((found) => {
                                if (
                                  found != null &&
                                  found.lastUpdate > value.timestamp
                                ) {
                                  return okAsync(undefined);
                                }

                                return this.volatileStorage.removeObject(
                                  tableName,
                                  value.value as VolatileStorageKey,
                                );
                              });
                        }
                      }),
                    );
                  }),
                );
              });
            })
            .andThen(() => {
              return this._addRestored(backup);
            });
        });
      },
    );
  }

  public unpackBackupChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._unpackBlob(backup.blob).andThen((backupBlob) => {
      return okAsync(JSON.stringify(backupBlob));
    });
  }

  public getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError> {
    return this.volatileStorage
      .getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS)
      .map((restored) => {
        return restored.map((item) => item.data.id);
      })
      .map((restored) => {
        return new Set(restored);
      });
  }

  private _verifyBackupSignature(
    backup: IDataWalletBackup,
  ): ResultAsync<boolean, PersistenceError> {
    return this._getContentHash(backup.blob).andThen((hash) => {
      return this.cryptoUtils
        .verifyEVMSignature(
          this._generateSignatureMessage(hash, backup.header.timestamp),
          Signature(backup.header.signature),
        )
        .andThen((addr) =>
          okAsync(addr == EVMAccountAddress(this.accountAddr)),
        );
    });
  }

  private _generateSignatureMessage(hash: string, timestamp: number): string {
    return JSON.stringify({
      hash: hash,
      timestamp: timestamp,
    });
  }

  private _getContentHash(
    blob: AESEncryptedString | BackupBlob,
  ): ResultAsync<string, PersistenceError> {
    return this.cryptoUtils
      .hashStringSHA256(JSON.stringify(blob))
      .map((hash) => {
        return hash.toString().replace(new RegExp("/", "g"), "-");
      });
  }

  private _updateFieldHistory(field: string, timestamp: number): void {
    if (!(field in this.fieldHistory) || this.fieldHistory[field] < timestamp) {
      this.fieldHistory[field] = timestamp;
    }
  }

  private _addRestored(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject(
      ERecordKey.RESTORED_BACKUPS,
      new VolatileStorageMetadata(
        EBackupPriority.NORMAL,
        new RestoredBackup(DataWalletBackupID(backup.header.hash)),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new RestoredBackupMigrator().getCurrentVersion(),
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

  public popBackup(): ResultAsync<
    IDataWalletBackup | undefined,
    PersistenceError
  > {
    if (this.chunkQueue.length == 0) {
      if (this.numUpdates == 0) {
        return okAsync(undefined);
      }

      const renderers = Array.from(this.chunkRenderingMap.values());
      return ResultUtils.combine(
        renderers.map((renderer) => {
          if (renderer.updates == 0) {
            return okAsync(undefined);
          }
          return renderer.clear(true).andThen((backup) => {
            if (backup == undefined) {
              return okAsync(undefined);
            }
            return okAsync(this.chunkQueue.push(backup));
          });
        }),
      ).andThen(() => {
        return this.clear().map(() => undefined);
      });
    }

    const backup = this.chunkQueue.pop()!;
    return this._addRestored(backup).map(() => backup);
  }

  private _checkSize(): ResultAsync<void, PersistenceError> {
    if (this.numUpdates >= this.maxChunkSize) {
      this.chunkRenderingMap.forEach((renderer) => {
        return renderer.clear(false).andThen((backup) => {
          if (backup != undefined) {
            this.chunkQueue.push(backup as IDataWalletBackup);
          }
          return this.clear();
        });
      });
    }

    return okAsync(undefined);
  }
}
