import {
  AESKey,
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface IChunkManager {
  size(): number;
  clear(): ResultAsync<void, never>;
  addChunk(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  removeChunk(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  fetchBackupChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<IDataWalletBackup, PersistenceError>;
  displayChunks(): ResultAsync<IDataWalletBackup[], PersistenceError>;
}

export const IChunkManagerType = Symbol.for("IChunkManager");
