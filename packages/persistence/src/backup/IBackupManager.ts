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

export interface IBackupManager {
  clear(): ResultAsync<void, never>;
  addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;
  updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;
  restore(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  popBackup(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError>;
  listBackupChunks(): ResultAsync<IDataWalletBackup[], PersistenceError>;
  fetchBackupChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
