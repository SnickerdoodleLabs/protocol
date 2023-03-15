import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  BackupBlob,
  DataUpdate,
  DataWalletBackup,
  DataWalletBackupHeader,
  DataWalletBackupID,
  EBackupPriority,
  EDataUpdateOpCode,
  EFieldKey,
  EVMPrivateKey,
  FieldDataUpdate,
  PersistenceError,
  Signature,
  StorageKey,
  UnixTimestamp,
  VersionedObject,
  VolatileDataUpdate,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IStorageIndex } from "@persistence/IStorageIndex.js";
import { FieldIndex } from "@persistence/local";
import { VolatileTableIndex } from "@persistence/volatile";

export class ChunkRenderer implements IChunkRenderer {
  private updates: VolatileDataUpdate[] | (FieldDataUpdate | null);

  private numUpdates = 0;
  private lastRender = Date.now();

  public constructor(
    public schema: IStorageIndex,
    public maxChunkSize: number,
    public enableEncryption: boolean,
    public cryptoUtils: ICryptoUtils,
    protected privateKey: EVMPrivateKey,
  ) {
    this.numUpdates = 0;
    this.updates = this.schema instanceof VolatileDataUpdate ? [] : null;
  }

  public clear(): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return this._dump(this.updates).map((result) => {
      this.numUpdates = 0;
      this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
      this.lastRender = Date.now();
      return result;
    });
  }

  public update(
    update: DataUpdate,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    if (
      (this.schema instanceof VolatileTableIndex &&
        update instanceof FieldDataUpdate) ||
      (this.schema instanceof FieldIndex &&
        update instanceof VolatileDataUpdate)
    ) {
      return errAsync(
        new PersistenceError("update type does not match renderer"),
      );
    }

    if (update instanceof FieldDataUpdate) {
      if (this.updates == null) {
        this.updates = update;
      }

      const existing = this.updates as FieldDataUpdate;
      if (update.timestamp > existing.timestamp) {
        this.updates = update;
      }

      if (Date.now() - this.lastRender >= this.schema.backupInterval) {
        return this.clear();
      } else {
        return okAsync(null);
      }
    }

    (this.updates as VolatileDataUpdate[]).push(update);
    if (
      ++this.numUpdates >= this.maxChunkSize ||
      Date.now() - this.lastRender >= this.schema.backupInterval
    ) {
      return this.clear();
    } else {
      return okAsync(null);
    }
  }

  private _dump(
    updates: VolatileDataUpdate[] | (FieldDataUpdate | null),
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    if (updates == null || this.numUpdates == 0) {
      return okAsync(null);
    }

    return this._getContentHash(updates as BackupBlob).andThen((hash) => {
      const timestamp = Date.now();
      return this._generateBackupSignature(hash, timestamp).andThen(
        (signature) => {
          const header = new DataWalletBackupHeader(
            hash,
            UnixTimestamp(timestamp),
            signature,
            this.schema.priority,
            this.schema.name,
          );

          if (!this.enableEncryption) {
            return okAsync(new DataWalletBackup(header, updates as BackupBlob));
          }

          return this.cryptoUtils
            .deriveAESKeyFromEVMPrivateKey(this.privateKey)
            .andThen((aesKey) => {
              return this.cryptoUtils
                .encryptString(JSON.stringify(updates), aesKey)
                .map((encryptedBlob) => {
                  return new DataWalletBackup(header, encryptedBlob);
                });
            });
        },
      );
    });
  }

  private _getContentHash(
    blob: BackupBlob,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    return this.cryptoUtils
      .hashStringSHA256(JSON.stringify(blob))
      .map((hash) => {
        return DataWalletBackupID(
          hash.toString().replace(new RegExp("/", "g"), "-"),
        );
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

  private _generateSignatureMessage(hash: string, timestamp: number): string {
    return JSON.stringify({
      hash: hash,
      timestamp: timestamp,
    });
  }
}
