import {
    ICryptoUtils,
    ICryptoUtilsType,
  } from "@snickerdoodlelabs/common-utils";
  import {
    FieldMap,
    TableMap,
    DataWalletAddress,
    VersionedObjectMigrator,
    VersionedObject,
    IDataWalletBackup,
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
    RestoredBackupMigrator,
  } from "@snickerdoodlelabs/objects";
  import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
  import { errAsync, okAsync, ResultAsync } from "neverthrow";
  import { ResultUtils } from "neverthrow-result-utils";
  
  import { EFieldKey, ERecordKey, LocalStorageKey } from "@persistence/ELocalStorageKey.js";
  import {
    IVolatileStorage,
    IVolatileStorageType,
    VolatileTableIndex,
  } from "@persistence/volatile/index.js";

  import { IChunkManager } from "@persistence/backup/IChunkManager.js";

  
  export class ChunkManager implements IChunkManager {
    private fieldUpdates: FieldMap = {};
    private tableUpdates: TableMap = {};
    private tableNames: string[];

    private priorityMap: Map<EBackupPriority, Array<IDataWalletBackup>> = new Map();
    private chunkFieldMap: Map<LocalStorageKey, Array<IDataWalletBackup>> = new Map();
    /*
        - Fields - lump these in by their high priority vs low priority
        - Table - separate by their table keys

        Heap a separate table of renderers

    */

    private numUpdates = 0;
    private migrators = new Map<
      string,
      VersionedObjectMigrator<VersionedObject>
    >();
    private fieldHistory: Map<string, number> = new Map();
    private deletionHistory: Map<VolatileStorageKey, number> = new Map();
    private chunkQueue: Array<IDataWalletBackup> = [];
  
    public constructor(
      protected privateKey: EVMPrivateKey,
      protected schema: VolatileTableIndex<VersionedObject>[],
      protected volatileStorage: IVolatileStorage,
      protected cryptoUtils: ICryptoUtils,
      protected storageUtils: IStorageUtils,
      public maxChunkSize: number,
    ) {
      this.tableNames = this.schema.map((x) => x.name);
      this.schema.forEach((x) => {
        this.migrators.set(x.name, x.migrator);
      });
      this.clear();
    }


    public clear(): ResultAsync<void, never> {
        this.numUpdates = 0;


        // this.tableUpdates = {};
        // this.fieldUpdates = {};
        this.priorityMap = new Map();
        this.chunkFieldMap = new Map();
    


        // this.tableNames.forEach((tableName) => (this.tableUpdates[tableName] = []));
        return okAsync(undefined);
    }

    public addRecord<T extends VersionedObject>(
        tableName: ERecordKey, // ERecordKey
        value: VolatileStorageMetadata<T>,
      ): ResultAsync<void, PersistenceError> {
        if (!this.chunkFieldMap.hasOwnProperty(tableName)) {
          return this.volatileStorage.putObject<T>(tableName, value);
        }

        this.chunkFieldMap[tableName].push(
            new VolatileDataUpdate(
              EDataUpdateOpCode.UPDATE,
              value.data,
              value.lastUpdate,
              value.priority,
              value.version,
            ),
        );
    
        // this.tableUpdates[tableName].push(
        //   new VolatileDataUpdate(
        //     EDataUpdateOpCode.UPDATE,
        //     value.data,
        //     value.lastUpdate,
        //     value.priority,
        //     value.version,
        //   ),
        // );
        this.numUpdates += 1;
        return this.volatileStorage
          .putObject(tableName, value)
          .andThen(() => this._checkSize());
    }

    public deleteRecord(
        tableName: ERecordKey,
        key: VolatileStorageKey,
        priority: EBackupPriority,
        timestamp: number = Date.now(),
      ): ResultAsync<void, PersistenceError> {

        this.ch

        if (!this.chunkFieldMap.hasOwnProperty(tableName)) {
          return this.volatileStorage.removeObject(tableName, key);
        }

        this.chunkFieldMap[tableName].push(
            new VolatileDataUpdate(
                EDataUpdateOpCode.REMOVE,
                key,
                timestamp,
                priority,
              ),
        );

        // this.tableUpdates[tableName].push(
        //   new VolatileDataUpdate(
        //     EDataUpdateOpCode.REMOVE,
        //     key,
        //     timestamp,
        //     priority,
        //   ),
        // );
        this.deletionHistory.set(key, timestamp);
        this.numUpdates += 1;
        return this.volatileStorage
          .removeObject(tableName, key)
          .andThen(() => this._checkSize());
    }

    
    public updateField(
        key: string,
        value: object,
        priority: EBackupPriority,
      ): ResultAsync<void, PersistenceError> {

        if (!(key in this.fieldUpdates)) {
          this.numUpdates += 1;
        }
    
        const serialized = JSON.stringify(value);
        const timestamp = Date.now();
        this.fieldUpdates[key] = new FieldDataUpdate(
          key,
          serialized,
          Date.now(),
          priority,
        );
        this._updateFieldHistory(key, timestamp);
        return this.storageUtils
          .write(key, serialized)
          .andThen(() => this._checkSize());
    }
  

  
    public popBackup(): ResultAsync<
      IDataWalletBackup | undefined,
      PersistenceError
    > {
      if (this.chunkQueue.length == 0) {
        if (this.numUpdates == 0) {
          return okAsync(undefined);
        }

        return this.dump().andThen((backup) => {
          return this._addRestored(backup).andThen(() => {
            return this.clear().map(() => backup);
          });
        });
      }
  
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const backup = this.chunkQueue.pop()!;
      return this._addRestored(backup).map(() => backup);
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
  
    private dump(): ResultAsync<IDataWalletBackup, PersistenceError> {
      return this._generateBlob().andThen(([blob, priority]) => {
        return this._getContentHash(blob).andThen((hash) => {
          const timestamp = new Date().getTime();
          return this._generateBackupSignature(hash, timestamp).andThen((sig) => {
            const backup: IDataWalletBackup = {
              header: {
                hash: hash,
                timestamp: UnixTimestamp(timestamp),
                signature: sig,
                priority: priority,
              },
              blob: blob,
            };
  
            return okAsync(backup);
          });
        });
      });
    }
  
    private _checkSize(): ResultAsync<void, PersistenceError> {
      if (this.numUpdates >= this.maxChunkSize) {
        return this.dump().andThen((backup) => {
          this.chunkQueue.push(backup);
          return this.clear();
        });
      }
  
      return okAsync(undefined);
    }
  
    private _generateBackupSignature(
      hash: string,
      timestamp: number,
    ): ResultAsync<Signature, never> {
      return this.cryptoUtils.signMessage(
        this._generateSignatureMessage(hash, timestamp),
        this.privateKey,
      );
    }
  
    private _generateBlob(): ResultAsync<
      [AESEncryptedString, EBackupPriority],
      PersistenceError
    > {
      const blob = new BackupBlob(this.fieldUpdates, this.tableUpdates);
      return this.cryptoUtils
        .deriveAESKeyFromEVMPrivateKey(this.privateKey)
        .andThen((aesKey) => {
          return ResultUtils.combine([
            this.cryptoUtils.encryptString(JSON.stringify(blob), aesKey),
            this._getBlobPriority(blob),
          ]);
        });
    }
  
    private _getBlobPriority(
      blob: BackupBlob,
    ): ResultAsync<EBackupPriority, never> {
      let result = EBackupPriority.NORMAL;
      Object.keys(blob.fields).map((key) => {
        const value = blob.fields[key];
        result = Math.max(result, value.priority);
      });
      Object.keys(blob.records).map((table) => {
        const updates = blob.records[table];
        updates.forEach((value) => {
          result = Math.max(result, value.priority);
        });
      });
      return okAsync(result);
    }
  
    private _generateSignatureMessage(hash: string, timestamp: number): string {
      return JSON.stringify({
        hash: hash,
        timestamp: timestamp,
      });
    }
  
    private _getContentHash(
      blob: AESEncryptedString,
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

    public restore(unpacked: BackupBlob): ResultAsync<void[][], PersistenceError> { 
    return ResultUtils.combine(
        Object.keys(unpacked.fields).map((fieldName) => {
        const update = unpacked.fields[fieldName];
        if (
            !(fieldName in this.fieldHistory) ||
            update.timestamp > this.fieldHistory[fieldName]
        ) {
            if (this.fieldUpdates.hasOwnProperty(fieldName)) {
            if (update.timestamp > this.fieldUpdates[fieldName][1]) {
                this.fieldHistory[fieldName] = update.timestamp;
                delete this.fieldUpdates[fieldName];
                return this.storageUtils.write(fieldName, update.value);
            }
            } else {
            this.fieldHistory[fieldName] = update.timestamp;
            return this.storageUtils.write(fieldName, update.value);
            }
        }
        return okAsync(undefined);
        }),
    )
            .andThen(() => {
              return ResultUtils.combine(
                Object.keys(unpacked.records).map((tableName) => {
                  const table = unpacked.records[tableName];
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const migrator = this.migrators.get(tableName)!;

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
    }
  }
  