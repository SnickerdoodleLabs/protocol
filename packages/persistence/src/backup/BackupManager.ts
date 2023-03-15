import {
  ICryptoUtils,
  ICryptoUtilsType,
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
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ChunkRenderer } from "./ChunkRenderer";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { FieldIndex } from "@persistence/local";
import {
  IVolatileStorage,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class BackupManager implements IBackupManager {
  private accountAddr: DataWalletAddress;

  private tableRenderers = new Map<ERecordKey, ChunkRenderer>();
  private fieldRenderers = new Map<EFieldKey, ChunkRenderer>();

  private fieldHistory: Map<string, number> = new Map();
  private deletionHistory: Map<VolatileStorageKey, number> = new Map();

  private renderedChunks = new Map<DataWalletBackupID, DataWalletBackup>();

  public constructor(
    protected privateKey: EVMPrivateKey,
    tables: VolatileTableIndex<VersionedObject>[],
    fields: FieldIndex[],
    protected cryptoUtils: ICryptoUtils,
    protected volatileStorage: IVolatileStorage,
    protected storageUtils: IStorageUtils,
    protected enableEncryption: boolean,
  ) {
    tables.forEach((schema) => {
      if (schema.priority != EBackupPriority.DISABLED) {
        this.tableRenderers.set(
          schema.name,
          new ChunkRenderer(schema, enableEncryption, cryptoUtils, privateKey),
        );
      }
    });
    fields.forEach((schema) => {
      this.fieldRenderers.set(
        schema.name,
        new ChunkRenderer(schema, enableEncryption, cryptoUtils, privateKey),
      );
    });

    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
    this.clear();
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._unpackBlob(backup.blob).andThen((backupBlob) => {
      return okAsync(JSON.stringify(backupBlob));
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

    this.tableUpdates[tableName].push(
      new VolatileDataUpdate(
        EDataUpdateOpCode.REMOVE,
        key,
        timestamp,
        priority,
      ),
    );
    this.deletionHistory.set(key, timestamp);
    this.numUpdates += 1;
    return this.volatileStorage
      .removeObject(tableName, key)
      .andThen(() => this._checkSize());
  }

  public clear(): ResultAsync<void, never> {
    this.tableUpdates = {};
    this.fieldUpdates = {};
    this.numUpdates = 0;
    Array.from(this.schemas.keys()).forEach(
      (tableName) => (this.tableUpdates[tableName] = []),
    );
    return okAsync(undefined);
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

  public addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    // this allows us to bypass transactions
    if (!this.schemas.has(tableName)) {
      return this.volatileStorage.putObject<T>(tableName, value);
    }

    this.tableUpdates[tableName].push(
      new VolatileDataUpdate(
        EDataUpdateOpCode.UPDATE,
        value.data,
        value.lastUpdate,
        value.priority,
        value.version,
      ),
    );
    this.numUpdates += 1;
    return this.volatileStorage
      .putObject(tableName, value)
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

  public restore(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    this._wasRestored(DataWalletBackupID(backup.header.hash)).andThen(
      (wasRestored) => {
        if (wasRestored) {
          return okAsync(undefined);
        }

        return this.cryptoUtils
          .verifyBackupSignature(backup, this.accountAddr as EVMAccountAddress)
          .andThen((valid) => {
            if (!valid) {
              return errAsync(new PersistenceError("invalid backup signature"));
            }

            return this._unpackBlob(backup.blob)
              .andThen((unpacked) => {
                if (Array.isArray(unpacked)) {
                  const updates =
                    unpacked as VolatileDataUpdate[];
                  return ResultUtils.combine(updates.map((update) => {
                    return this.volatileStorage.putObject(update.)
                  }));
                } else {
                }
              })
              .andThen(() => {
                return this._addRestored(backup);
              });
          });
      },
    );

    return okAsync(undefined);
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

  private _updateFieldHistory(field: string, timestamp: number): void {
    if (!(field in this.fieldHistory) || this.fieldHistory[field] < timestamp) {
      this.fieldHistory[field] = timestamp;
    }
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

  private _addRestored(
    backup: DataWalletBackup,
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
}
