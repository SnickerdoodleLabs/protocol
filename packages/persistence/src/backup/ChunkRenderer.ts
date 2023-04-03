import { ICryptoUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  BackupBlob,
  DataUpdate,
  DataWalletBackup,
  DataWalletBackupHeader,
  EVMPrivateKey,
  FieldDataUpdate,
  PersistenceError,
  UnixTimestamp,
  VersionedObject,
  VolatileDataUpdate,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IStorageIndex } from "@persistence/IStorageIndex.js";
import { FieldIndex } from "@persistence/local/index.js";
import { VolatileTableIndex } from "@persistence/volatile/index.js";

export class ChunkRenderer implements IChunkRenderer {
  private updates: VolatileDataUpdate[] | FieldDataUpdate | null;
  private lastRender: number;

  public constructor(
    public schema: IStorageIndex,
    public enableEncryption: boolean,
    public cryptoUtils: ICryptoUtils,
    public backupUtils: IBackupUtils,
    protected privateKey: EVMPrivateKey,
    protected timeUtils: ITimeUtils,
  ) {
    this.lastRender = timeUtils.getUnixNow();
    this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
  }

  public clear(): ResultAsync<DataWalletBackup | null, PersistenceError> {
    const deepcopy = JSON.parse(JSON.stringify(this.updates)) as
      | VolatileDataUpdate[]
      | (FieldDataUpdate | null);
    this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
    this.lastRender = this.timeUtils.getUnixNow();
    return this._dump(deepcopy);
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
      const existing = this.updates as FieldDataUpdate | null;
      if (existing == null || update.timestamp > existing.timestamp) {
        this.updates = update;

        if (
          this.timeUtils.getUnixNow() - this.lastRender >=
          this.schema.backupInterval
        ) {
          return this.clear();
        }
      }

      return okAsync(null);
    }

    const recordUpdates = this.updates as VolatileDataUpdate[];
    recordUpdates.push(update);
    if (
      recordUpdates.length >=
        (this.schema as VolatileTableIndex<VersionedObject>).maxChunkSize ||
      this.timeUtils.getUnixNow() - this.lastRender >=
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
    if (updates == null || (Array.isArray(updates) && updates.length == 0)) {
      return okAsync(null);
    }

    return this.backupUtils
      .getBackupHash(updates as BackupBlob)
      .andThen((hash) => {
        const timestamp = this.timeUtils.getUnixNow();
        return this.backupUtils
          .generateBackupSignature(hash, timestamp, this.privateKey)
          .andThen((signature) => {
            const header = new DataWalletBackupHeader(
              hash,
              UnixTimestamp(timestamp),
              signature,
              this.schema.priority,
              this.schema.name,
              this.schema instanceof FieldIndex,
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
