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
import {
  EFieldKey,
  ERecordKey,
  LocalStorageKey,
} from "packages/objects/src/enum/ELocalStorageKey";

import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import {
  IVolatileStorage,
  IVolatileStorageType,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class ChunkRenderer implements IChunkRenderer {
  private fieldUpdates: FieldMap = {};
  private tableUpdates: TableMap = {};
  private updatesMap;
  private numUpdates = 0;

  private migrators = new Map<
    string,
    VersionedObjectMigrator<VersionedObject>
  >();
  private fieldHistory: Map<string, number> = new Map();
  private deletionHistory: Map<VolatileStorageKey, number> = new Map();

  public constructor(
    protected privateKey: EVMPrivateKey,
    protected volatileStorage: IVolatileStorage,
    protected cryptoUtils: ICryptoUtils,
    protected storageUtils: IStorageUtils,
    public key: LocalStorageKey,
  ) {
    this.clear();
    if (typeof key == typeof EFieldKey) {
      this.updatesMap = this.fieldUpdates;
    } else {
      this.updatesMap = this.tableUpdates;
    }
  }

  public clear(): ResultAsync<void, never> {
    this.numUpdates = 0;
    this.updatesMap = {};
    return okAsync(undefined);
  }

  public addRecord<T extends VersionedObject>(
    tableName: ERecordKey, // ERecordKey
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    this.numUpdates += 1;
    this.updatesMap[this.key].push(
      new VolatileDataUpdate(
        EDataUpdateOpCode.UPDATE,
        value.data,
        value.lastUpdate,
        value.priority,
        value.version,
      ),
    );
    return this.volatileStorage.putObject<T>(this.key, value);
  }

  public deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
    priority: EBackupPriority,
    timestamp: number = Date.now(),
  ): ResultAsync<void, PersistenceError> {
    this.numUpdates += 1;
    this.deletionHistory.set(key, timestamp);
    this.tableUpdates[this.key].push(
      new VolatileDataUpdate(
        EDataUpdateOpCode.REMOVE,
        key,
        timestamp,
        priority,
      ),
    );
    return this.volatileStorage.removeObject(tableName, this.key);
  }

  public updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    const serialized = JSON.stringify(value);
    const timestamp = Date.now();
    this.updatesMap[this.key] = new FieldDataUpdate(
      key,
      serialized,
      Date.now(),
      priority,
    );
    this._updateFieldHistory(key, timestamp);
    return this.storageUtils.write(key, serialized);
  }

  public popBackup(): ResultAsync<
    IDataWalletBackup | undefined,
    PersistenceError
  > {
    if (this.numUpdates == 0) {
      return okAsync(undefined);
    }

    return this.dump().andThen((backup) => {
      return this._addRestored(backup).andThen(() => {
        return this.clear().map(() => backup);
      });
    });
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

  public dump(): ResultAsync<IDataWalletBackup, PersistenceError> {
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
              // Update with ERecordKey | EBackupPriority
              dataType: 0,
            },
            blob: blob,
          };

          return okAsync(backup);
        });
      });
    });
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

  public restore(
    unpacked: BackupBlob,
  ): ResultAsync<void[][], PersistenceError> {
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
    ).andThen(() => {
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
                              this.deletionHistory.get(key)! > value.timestamp)
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
                    .getObject(tableName, value.value as VolatileStorageKey)
                    .andThen((found) => {
                      if (found != null && found.lastUpdate > value.timestamp) {
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
