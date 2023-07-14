import { ITimeUtils, ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  DataWalletBackup,
  DataWalletBackupHeader,
  EDataStorageType,
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
import { FieldIndex } from "@persistence/local/index.js";
import { VolatileTableIndex } from "@persistence/volatile/index.js";

export class ChunkRenderer implements IChunkRenderer {
  protected lastRender: UnixTimestamp;
  protected volatileDataUpdates: VolatileDataUpdate[] = [];
  protected fieldUpdate: FieldDataUpdate | null = null;
  protected mode: EDataStorageType;

  public constructor(
    protected schema: FieldIndex | VolatileTableIndex<VersionedObject>,
    protected enableEncryption: boolean,
    protected privateKey: EVMPrivateKey,
    protected backupUtils: IBackupUtils,
    protected timeUtils: ITimeUtils,
  ) {
    this.lastRender = UnixTimestamp(-1);
    if (schema instanceof FieldIndex) {
      this.mode = EDataStorageType.Field;
    } else {
      this.mode = EDataStorageType.Record;
    }
  }

  public checkInterval(): ResultAsync<
    DataWalletBackup | null,
    PersistenceError
  > {
    const now = this.timeUtils.getUnixNow();
    if (this.lastRender == -1) {
      this.lastRender = now;
    }

    // If we haven't done a backup in our backupInterval, push out a backup
    if (now - this.lastRender >= this.schema.backupInterval) {
      return this.clear();
    }
    return okAsync(null);
  }

  public clear(): ResultAsync<DataWalletBackup | null, PersistenceError> {
    this.lastRender = this.timeUtils.getUnixNow();
    if (this.mode == EDataStorageType.Field) {
      if (this.fieldUpdate == null) {
        return okAsync(null);
      }

      const deepcopy = ObjectUtils.toGenericObject(
        this.fieldUpdate,
      ) as unknown as FieldDataUpdate;
      this.fieldUpdate = null;
      return this._dump(deepcopy);
    }

    if (this.volatileDataUpdates.length == 0) {
      return okAsync(null);
    }

    const deepcopy = ObjectUtils.toGenericObject(
      this.volatileDataUpdates,
    ) as unknown as VolatileDataUpdate[];
    this.volatileDataUpdates = [];
    return this._dump(deepcopy);
  }

  public update(
    update: FieldDataUpdate | VolatileDataUpdate,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    if (
      (this.mode == EDataStorageType.Record &&
        update instanceof FieldDataUpdate) ||
      (this.mode == EDataStorageType.Field &&
        update instanceof VolatileDataUpdate)
    ) {
      return errAsync(
        new PersistenceError("update type does not match renderer"),
      );
    }

    if (update instanceof FieldDataUpdate) {
      if (
        this.fieldUpdate == null ||
        update.timestamp > this.fieldUpdate.timestamp
      ) {
        this.fieldUpdate = update;
        return this.checkInterval();
      }
      return okAsync(null);
    }

    if (update instanceof VolatileDataUpdate) {
      this.volatileDataUpdates.push(update);
      if (
        this.volatileDataUpdates.length >=
        (this.schema as VolatileTableIndex<VersionedObject>).maxChunkSize
      ) {
        return this.clear();
      }
      return this.checkInterval();
    }
    return okAsync(null);
  }

  private _dump(
    updates: VolatileDataUpdate[] | FieldDataUpdate,
  ): ResultAsync<DataWalletBackup, PersistenceError> {
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
                this.mode == EDataStorageType.Field,
              );

              return new DataWalletBackup(header, encryptedBlob);
            });
        });
      });
  }
}
