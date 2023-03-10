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
  ChunkRenderMapKey,
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
  private numUpdates = 0;
  private chunkRendererKey = 0;
  private chunkCheckSizeKey = 0;

  private chunkQueue: Array<IDataWalletBackup> = [];
  private chunkRenderingMap: Map<ChunkRenderMapKey, ChunkRenderer> = new Map();
  private chunkUpdatesTracking: Map<ChunkRenderMapKey, number> = new Map();

  /*  
    - Fields - lump these in by their high priority vs low priority
    - Table - separate by their table keys
  */
  public constructor(
    protected privateKey: EVMPrivateKey,
    protected schema: VolatileTableIndex<VersionedObject>[],
    protected volatileStorage: IVolatileStorage,
    protected cryptoUtils: ICryptoUtils,
    protected storageUtils: IStorageUtils,
    public maxChunkSize: number,
    protected enableEncryption: boolean,
  ) {
    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );

    this.schema.forEach((tableHeaderName) => {
      this.chunkRenderingMap.set(
        tableHeaderName.name as ChunkRenderMapKey,
        new ChunkRenderer(
          this.privateKey,
          this.volatileStorage,
          this.cryptoUtils,
          this.storageUtils,
          this.maxChunkSize,
          tableHeaderName.name as EFieldKey,
        ),
      );
    });
    this.clear();
  }

  public unpackBackupChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    console.log("fetchBackupChunk: ", backup.blob);
    return this._unpackBlob(backup.blob).andThen((backupBlob) => {
      console.log("backupBlob: ", backupBlob);
      return okAsync(JSON.stringify(backupBlob));
    });
  }

  public getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError> {
    return this.volatileStorage
      .getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS)
      .map((restored) => {
        console.log("restored: ", restored);
        return restored.map((item) => item.data.id);
      })
      .map((restored) => {
        return new Set(restored);
      });
  }

  private _addRestored(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    console.log("backup: ", backup);
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
    console.log("restore my backup: ", backup);

    return this._wasRestored(DataWalletBackupID(backup.header.hash)).andThen(
      (wasRestored) => {
        console.log("wasRestored status: ", wasRestored);
        if (wasRestored) {
          return okAsync(undefined);
        }

        console.log("wasRestored status: ", wasRestored);
        return this._verifyBackupSignature(backup).andThen((valid) => {
          console.log("valid signature: ", valid);

          if (!valid) {
            return errAsync(new PersistenceError("invalid backup signature"));
          }

          return this._unpackBlob(backup.blob)
            .andThen((unpacked) => {
              console.log("unpack blob: ", backup.blob);
              const renderers = Array.from(this.chunkRenderingMap.values());
              return ResultUtils.combine(
                renderers.map((renderer) => {
                  return renderer.restore(unpacked);
                }),
              );
            })
            .andThen(() => {
              return this._addRestored(backup);
            });
        });
      },
    );
  }

  private _unpackBlob(
    blob: AESEncryptedString | BackupBlob,
  ): ResultAsync<BackupBlob, PersistenceError> {
    console.log("_unpackBlob: ", blob);

    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(
          blob as AESEncryptedString,
          aesKey,
        );
      })
      .map((unencrypted) => {
        console.log("raw blob unencrypted: ", JSON.parse(unencrypted));
        console.log("raw blob: ", JSON.parse(unencrypted) as BackupBlob);
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
    blob: AESEncryptedString | BackupBlob,
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
  }

  public updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    if (this.chunkRenderingMap.get(key as ChunkRenderMapKey) == undefined) {
      this.chunkRenderingMap.set(
        priority as ChunkRenderMapKey,
        new ChunkRenderer(
          this.privateKey,
          this.volatileStorage,
          this.cryptoUtils,
          this.storageUtils,
          this.maxChunkSize,
          key as ELocalStorageKey,
        ),
      );
    }
    const renderer = this.chunkRenderingMap.get(priority as ChunkRenderMapKey);
    return renderer!.updateField(key, value, priority).andThen(() => {
      this.countRendererUpdates(key as ChunkRenderMapKey);
      this.numUpdates += 1;
      return this._checkSize();
    });
  }

  public deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
    timestamp: number = Date.now(),
  ): ResultAsync<void, PersistenceError> {
    const renderer = this.chunkRenderingMap.get(key as ChunkRenderMapKey);
    return renderer!
      .deleteRecord(tableName as ERecordKey, key, priority, timestamp)
      .andThen((chunk) => {
        this.countRendererUpdates(tableName as ChunkRenderMapKey);
        if (chunk == undefined) {
          return okAsync(undefined);
        }
        this.chunkQueue.push(chunk);
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
        return renderer!.dump().andThen((backup) => {
          this.chunkQueue.push(backup);
          return this.clear();
        });
      });
    }

    const backup = this.chunkQueue.pop()!;
    return this._addRestored(backup).map(() => backup);
  }

  private countRendererUpdates(key: ChunkRenderMapKey): void {
    if (!this.chunkUpdatesTracking.has(key as ChunkRenderMapKey)) {
      this.chunkUpdatesTracking.set(key as ChunkRenderMapKey, 1);
    }
    const counter = this.chunkUpdatesTracking.get(key as ChunkRenderMapKey);
    this.chunkUpdatesTracking.set(key as ChunkRenderMapKey, counter!);
  }

  public addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    const renderer = this.chunkRenderingMap.get(tableName as ChunkRenderMapKey);
    return renderer!
      .addRecord(tableName as ERecordKey, value)
      .andThen((chunk) => {
        this.countRendererUpdates(tableName as ChunkRenderMapKey);
        if (chunk == undefined) {
          return okAsync(undefined);
        }
        this.chunkQueue.push(chunk);

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
