import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  BackupBlob,
  DataUpdate,
  EBackupPriority,
  EDataUpdateOpCode,
  EFieldKey,
  EVMPrivateKey,
  FieldDataUpdate,
  FieldMap,
  IDataWalletBackup,
  PersistenceError,
  Signature,
  TableMap,
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

  public clear(): ResultAsync<IDataWalletBackup | null, never> {
    return this._dump(this.updates).map((result) => {
      this.numUpdates = 0;
      this.updates = this.schema instanceof VolatileDataUpdate ? [] : null;
      return result;
    });
  }

  public update(
    update: DataUpdate,
  ): ResultAsync<IDataWalletBackup | null, PersistenceError> {
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

    if (update instanceof VolatileDataUpdate) {
      (this.updates as VolatileDataUpdate[]).push(update);
      if (++this.numUpdates >= this.maxChunkSize) {
        return this.clear();
      }
    }
  }

  private _dump(updates: ): ResultAsync<IDataWalletBackup | null, never> {
    if ()
  }
}
