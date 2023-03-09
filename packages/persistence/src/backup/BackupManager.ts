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
  // private tableNames: string[];
  // private fieldUpdates: string[];
  private numUpdates = 0;
  private chunkRendererKey = 0;
  private chunkCheckSizeKey = 0;

  private chunkQueue: Array<IDataWalletBackup> = [];
  private chunkRenderingMap: Map<ChunkRenderMapKey, ChunkRenderer> = new Map();

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
    console.log("this.schema: ", this.schema);
    console.log(
      "this.schema names: ",
      this.schema.map((x) => x.name),
    );

    this.schema.forEach((tableHeaderName) => {
      console.log("Schema : ", tableHeaderName);
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
    console.log("Backup Manager: add Restored: ", backup);
    console.log("Backup Manager: add Restored: ", backup.header);
    console.log("Backup Manager: add Restored: ", backup.header.hash);

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
    console.log("_wasRestored: ", id);
    return this.volatileStorage
      .getObject<RestoredBackup>(ERecordKey.RESTORED_BACKUPS, id)
      .map((result) => {
        return result != null;
      });
  }

  public restore(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    console.log("restore: ", backup);

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
              // return okAsync(this.chunkRenderingMap.)
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
    console.log("key as ELocalStorageKey: ", key as ChunkRenderMapKey);

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
    console.log("updateField renderer: ", renderer);

    return renderer!.updateField(key, value, priority).andThen(() => {
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
      .andThen(() => {
        this.numUpdates += 1;
        return this._checkSize();
      });
  }

  public popBackup(): ResultAsync<
    IDataWalletBackup | undefined,
    PersistenceError
  > {
    console.log("inside pop backup: ", this.chunkQueue.length);
    if (this.chunkQueue.length == 0) {
      console.log("this.numUpdates: ", this.numUpdates);
      if (this.numUpdates == 0) {
        return okAsync(undefined);
      }
      this.chunkRenderingMap.forEach((renderer) => {
        console.log("renderer.updates:  ", renderer.updates);
      });

      const renderers = Array.from(this.chunkRenderingMap.values());

      if (this.chunkRendererKey < renderers.length - 1) {
        this.chunkRendererKey = this.chunkRendererKey + 1;
      } else {
        this.chunkRendererKey = 0;
      }

      console.log("this.chunkRendererKey: ", this.chunkRendererKey);
      return renderers[this.chunkRendererKey].popBackup();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    console.log("this.chunkQueue.length: ", this.chunkQueue.length);
    console.log("this.numUpdates: ", this.numUpdates);

    const backup = this.chunkQueue.pop()!;
    console.log("backup listed: ", backup);
    return this._addRestored(backup).map(() => backup);
  }

  public addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    const renderer = this.chunkRenderingMap.get(tableName as ChunkRenderMapKey);
    return renderer!.addRecord(tableName as ERecordKey, value).andThen(() => {
      this.numUpdates += 1;
      return this._checkSize();
    });
  }

  private _checkSize(): ResultAsync<void, PersistenceError> {
    console.log("_checkSize this.numUpdates: ", this.numUpdates);
    console.log("_checkSize this.maxChunkSize: ", this.maxChunkSize);

    if (this.numUpdates >= this.maxChunkSize) {
      console.log("_checkSize dump renderer: ");

      // const renderers = Array.from(this.chunkRenderingMap.values());
      // if (this.chunkCheckSizeKey < renderers.length - 1) {
      //   this.chunkCheckSizeKey = this.chunkCheckSizeKey + 1;
      // } else {
      //   this.chunkCheckSizeKey = 0;
      // }

      // console.log("this.chunkRendererKey: ", this.chunkRendererKey);
      // return renderers[this.chunkRendererKey].popBackup();

      this.chunkRenderingMap.forEach((renderer) => {
        this.chunkCheckSizeKey = this.chunkCheckSizeKey + 1;
        console.log("_checkSize: ", this.chunkCheckSizeKey);
        return renderer!.dump().andThen((backup) => {
          console.log("backup manager dump: ", backup);
          this.chunkQueue.push(backup);
          return this.clear();
        });
      });
    }

    return okAsync(undefined);
  }
}
