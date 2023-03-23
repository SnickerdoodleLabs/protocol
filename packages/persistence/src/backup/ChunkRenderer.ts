import { ICryptoUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
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

import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IStorageIndex } from "@persistence/IStorageIndex.js";
import { FieldIndex } from "@persistence/local/index.js";
import { VolatileTableIndex } from "@persistence/volatile/index.js";

export class ChunkRenderer implements IChunkRenderer {
  private updates: VolatileDataUpdate[] | (FieldDataUpdate | null);

  private numUpdates = 0;
  private lastRender;

  public constructor(
    public schema: IStorageIndex,
    public enableEncryption: boolean,
    public cryptoUtils: ICryptoUtils,
    public backupUtils: IBackupUtils,
    protected privateKey: EVMPrivateKey,
    protected timeUtils: ITimeUtils,
  ) {
    this.lastRender = timeUtils.getUnixNowMS();
    this.numUpdates = 0;
    this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
  }

  public clear(): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return this._dump(this.updates).map((result) => {
      this.numUpdates = 0;
      this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
      this.lastRender = this.timeUtils.getUnixNowMS();
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

      if (
        this.timeUtils.getUnixNowMS() - this.lastRender >=
        this.schema.backupInterval
      ) {
        return this.clear();
      } else {
        return okAsync(null);
      }
    }

    (this.updates as VolatileDataUpdate[]).push(update);
    this.numUpdates++;
    if (
      this.numUpdates >=
        (this.schema as VolatileTableIndex<VersionedObject>).maxChunkSize ||
      this.timeUtils.getUnixNowMS() - this.lastRender >=
        this.schema.backupInterval
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

    return this.backupUtils
      .getBackupHash(updates as BackupBlob)
      .andThen((hash) => {
        const timestamp = this.timeUtils.getUnixNowMS();
        return this.backupUtils
          .generateBackupSignature(hash, timestamp, this.privateKey)
          .andThen((signature) => {
            const header = new DataWalletBackupHeader(
              hash,
              UnixTimestamp(timestamp),
              signature,
              this.schema.priority,
              this.schema.name,
            );

            if (!this.enableEncryption) {
              return okAsync(
                new DataWalletBackup(header, updates as BackupBlob),
              );
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
          });
      });
  }
}
