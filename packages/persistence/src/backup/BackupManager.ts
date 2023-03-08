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
  ELocalStorageKey,
  EFieldKey,
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

export class BackupManager implements IBackupManager {
  private accountAddr: DataWalletAddress;
  // private tableNames: string[];
  // private fieldUpdates: string[];
  private numUpdates = 0;

  private chunkQueue: Array<IDataWalletBackup> = [];
  private chunkRenderingMap: Map<ELocalStorageKey, ChunkRenderer> = new Map();
  /*  
    - Fields - lump these in by their high priority vs low priority
    - Table - separate by their table keys
    Heap a separate table of renderers
  */

  public constructor(
    protected privateKey: EVMPrivateKey,
    protected schema: VolatileTableIndex<VersionedObject>[],
    protected volatileStorage: IVolatileStorage,
    protected cryptoUtils: ICryptoUtils,
    protected storageUtils: IStorageUtils,
    public maxChunkSize: number,
  ) {
    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
    // this.tableNames = this.schema.map((x) => x.name);
    // this.fieldUpdates = this.schema.map((x) => x.name);
    console.log("this.schema: ", this.schema);
    console.log(
      "this.schema names: ",
      this.schema.map((x) => x.name),
    );

    this.schema.forEach((tableHeaderName) => {
      console.log("Schema : ", tableHeaderName);
      this.chunkRenderingMap.set(
        tableHeaderName.name as ELocalStorageKey,
        new ChunkRenderer(
          this.privateKey,
          this.volatileStorage,
          this.cryptoUtils,
          this.storageUtils,
          tableHeaderName.name as ELocalStorageKey,
        ),
      );
    });
    this.clear();
  }

  public fetchBackupChunk(
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
              return okAsync(undefined);
              // return okAsync(this.chunkManager.restore(unpacked));
            })
            .andThen(() => {
              return this._addRestored(backup);
            });
        });
      },
    );
  }

  private _unpackBlob(
    blob: AESEncryptedString,
  ): ResultAsync<BackupBlob, PersistenceError> {
    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(blob, aesKey);
      })
      .map((unencrypted) => {
        return JSON.parse(unencrypted) as BackupBlob;
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
    blob: AESEncryptedString,
  ): ResultAsync<string, PersistenceError> {
    return this.cryptoUtils
      .hashStringSHA256(JSON.stringify(blob))
      .map((hash) => {
        return hash.toString().replace(new RegExp("/", "g"), "-");
      });
  }

  public clear(): ResultAsync<void, never> {
    this.numUpdates = 0;
    return okAsync(undefined);
    // return this.chunkManager.clear();
  }

  public updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    console.log("updateField: ", key);
    console.log("updateField value: ", value);
    console.log("updateField priority: ", priority);
    console.log("this.chunkRenderingMap: ", this.chunkRenderingMap);
    console.log("key as ELocalStorageKey: ", key as ELocalStorageKey);

    if (this.chunkRenderingMap.get(key as ELocalStorageKey) == undefined) {
      this.chunkRenderingMap.set(
        key as EFieldKey,
        new ChunkRenderer(
          this.privateKey,
          this.volatileStorage,
          this.cryptoUtils,
          this.storageUtils,
          key as EFieldKey,
        ),
      );
    }
    const renderer = this.chunkRenderingMap.get(key as ELocalStorageKey);
    console.log("updateField renderer: ", renderer);

    return renderer!.updateField(key, value, priority).andThen(() => {
      return this._checkSize();
    });
  }

  public deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
    timestamp: number = Date.now(),
  ): ResultAsync<void, PersistenceError> {
    const renderer = this.chunkRenderingMap.get(key as ELocalStorageKey);
    return renderer!
      .deleteRecord(tableName as ERecordKey, key, priority, timestamp)
      .andThen(() => {
        return this._checkSize();
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
      this.chunkRenderingMap.forEach((renderer) => {
        return renderer.popBackup();
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
    const renderer = this.chunkRenderingMap.get(tableName as ELocalStorageKey);
    return renderer!.addRecord(tableName as ERecordKey, value).andThen(() => {
      return this._checkSize();
    });
  }

  private _checkSize(): ResultAsync<void, PersistenceError> {
    if (this.numUpdates >= this.maxChunkSize) {
      this.chunkRenderingMap.forEach((renderer) => {
        return renderer!.dump().andThen((backup) => {
          this.chunkQueue.push(backup);
          return this.clear();
        });
      });
    }

    return okAsync(undefined);
  }
}
