import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  FieldMap,
  VersionedObjectMigrator,
  VersionedObject,
  IDataWalletBackup,
  EVMPrivateKey,
  VolatileStorageKey,
  EBackupPriority,
  PersistenceError,
  VolatileDataUpdate,
  EDataUpdateOpCode,
  VolatileStorageMetadata,
  FieldDataUpdate,
  UnixTimestamp,
  AESEncryptedString,
  BackupBlob,
  Signature,
  LocalStorageKey,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import {
  IVolatileStorage,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class ChunkRenderer implements IChunkRenderer {
  public fieldUpdates: FieldMap = {};
  public tableUpdates = {};
  private numUpdates = 0;

  private fieldHistory: Map<string, number> = new Map();
  private deletionHistory: Map<VolatileStorageKey, number> = new Map();

  public constructor(
    protected privateKey: EVMPrivateKey,
    protected cryptoUtils: ICryptoUtils,
    protected maxChunkSize: number,
    public key: LocalStorageKey,
    protected enableEncryption: boolean,
  ) {
    this.numUpdates = 0;
    this.fieldUpdates = {};
    this.tableUpdates[this.key] = [];
  }

  public get updates(): number {
    return this.numUpdates;
  }

  public clear(
    forceRender: boolean,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError> {
    if (this.numUpdates >= this.maxChunkSize || forceRender) {
      return this.dump().map((backup) => {
        this.numUpdates = 0;
        this.tableUpdates[this.key] = [];
        this.fieldUpdates = {};
        return backup;
      });
    }
    return okAsync(undefined);
  }

  public addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError> {
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
    return this._checkSize();
  }

  private _checkSize(): ResultAsync<
    IDataWalletBackup | undefined,
    PersistenceError
  > {
    if (this.numUpdates >= this.maxChunkSize) {
      return this.dump().andThen((backup) => {
        return okAsync(backup);
      });
    }
    return okAsync(undefined);
  }

  public deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
    timestamp: number = Date.now(),
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError> {
    this.numUpdates += 1;
    this.deletionHistory.set(key, timestamp);
    this.tableUpdates[tableName].push(
      new VolatileDataUpdate(
        EDataUpdateOpCode.REMOVE,
        key,
        timestamp,
        priority,
      ),
    );
    return this._checkSize();
  }

  public updateField(
    key: string,
    serialized: string,
    priority: EBackupPriority,
    timestamp: number,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError> {
    this.fieldUpdates[key] = new FieldDataUpdate(
      key,
      serialized,
      Date.now(),
      priority,
    );
    this._updateFieldHistory(key, timestamp);
    this.numUpdates += 1;
    return this._checkSize();
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
              dataType: this.key,
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
    [AESEncryptedString | BackupBlob, EBackupPriority],
    PersistenceError
  > {
    const blob = new BackupBlob(this.fieldUpdates, this.tableUpdates);
    if (!this.enableEncryption) {
      return this._getBlobPriority(blob).map((priority) => {
        return [blob, priority];
      });
    }
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
}
