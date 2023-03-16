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
        return this.volatileStorage.putObject(tableName, value).andThen(() => {
          if (!this.tableRenderers.has(tableName)) {
            return errAsync(
              new PersistenceError("no renderer for table", tableName),
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.tableRenderers
            .get(tableName)!
            .update(
              new VolatileDataUpdate(
                EDataUpdateOpCode.UPDATE,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                key!,
                value.lastUpdate,
                value.data,
                value.version,
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
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public updateField(
    key: EFieldKey,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public restore(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getRendered(): ResultAsync<DataWalletBackup[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public popRendered(
    id: DataWalletBackupID,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
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
      .getObject<T>(tableName, key)
      .andThen((found) => {
        if (found == null) {
          return okAsync(true);
        }
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
