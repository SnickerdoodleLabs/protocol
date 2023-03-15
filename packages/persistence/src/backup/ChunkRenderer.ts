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
import { ResultUtils } from "neverthrow-result-utils";

import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { VolatileTableIndex } from "@persistence/volatile";

export class ChunkRenderer implements IChunkRenderer {
  private updates: VolatileDataUpdate[] | (FieldDataUpdate | null);
  private numUpdates = 0;

  public constructor(
    public schema: VolatileTableIndex<VersionedObject> | EFieldKey,
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
      this.updates = this.schema instanceof VolatileDataUpdate ? [] : null;
      return result;
    });
  }

  public update(
    update: DataUpdate,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    if (
      (this.schema instanceof VolatileDataUpdate &&
        update instanceof FieldDataUpdate) ||
      (this.schema instanceof FieldDataUpdate &&
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

      // since we are overwriting the number of updates is irrelevant.
      // we can wait for an explicit dump operation.
      return okAsync(null);
    }

    (this.updates as VolatileDataUpdate[]).push(update);
    if (++this.numUpdates >= this.maxChunkSize) {
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
            this._getBlobPriority(updates as BackupBlob),
            this._getDataType(),
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

  private _getBlobPriority(blob: BackupBlob): EBackupPriority {
    if (blob instanceof FieldDataUpdate) {
      return blob.priority;
    }
    return (this.schema as VolatileTableIndex<VersionedObject>).priority;
  }

  private _getDataType(): StorageKey {
    if (this.schema instanceof VolatileTableIndex) {
      return this.schema.name;
    }
    return this.schema as EFieldKey;
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
