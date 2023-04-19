import {
  ICryptoUtils,
  ITimeUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
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
  private lastRender: UnixTimestamp;

  public constructor(
    public schema: IStorageIndex,
    public enableEncryption: boolean,
    public cryptoUtils: ICryptoUtils,
    public backupUtils: IBackupUtils,
    protected privateKey: EVMPrivateKey,
    protected timeUtils: ITimeUtils,
  ) {
    this.lastRender = UnixTimestamp(-1);
    this.updates = this.schema instanceof VolatileTableIndex ? [] : null;
  }

  public checkInterval(): ResultAsync<
    DataWalletBackup | null,
    PersistenceError
  > {
    if (this.lastRender == -1) {
      this.lastRender = this.timeUtils.getUnixNow();
    }

    if (
      this.timeUtils.getUnixNow() - this.lastRender >=
      this.schema.backupInterval
    ) {
      return this.clear();
    }
    return okAsync(null);
  }

  public clear(): ResultAsync<DataWalletBackup | null, PersistenceError> {
    const deepcopy = ObjectUtils.toGenericObject(this.updates) as unknown as
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
        return this.checkInterval();
      }

      return okAsync(null);
    }

    const recordUpdates = this.updates as VolatileDataUpdate[];
    recordUpdates.push(update);
    if (
      recordUpdates.length >=
      (this.schema as VolatileTableIndex<VersionedObject>).maxChunkSize
    ) {
      return this.clear();
    } else {
      return this.checkInterval();
    }
  }

  private _dump(
    updates: VolatileDataUpdate[] | (FieldDataUpdate | null),
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    if (updates == null || (Array.isArray(updates) && updates.length == 0)) {
      return okAsync(null);
    }

    return this.backupUtils
      .encryptBlob(updates, this.enableEncryption ? this.privateKey : null)
      .andThen((encryptedBlob) => {
        return this.backupUtils.getBackupHash(encryptedBlob).andThen((hash) => {
          const timestamp = this.timeUtils.getUnixNow();
          return this.backupUtils
            .generateBackupSignature(hash, timestamp, this.privateKey)
            .map((signature) => {
              const header = new DataWalletBackupHeader(
                hash,
                UnixTimestamp(timestamp),
                signature,
                this.schema.priority,
                this.schema.name,
                this.schema instanceof FieldIndex,
              );

              return new DataWalletBackup(header, encryptedBlob);
            });
        });
      });
  }
}
