import {
  DataWalletBackupID,
  DataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
  ERecordKey,
  EFieldKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface IBackupManager {
  addRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError>;
  updateField(
    key: EFieldKey,
    value: unknown,
  ): ResultAsync<void, PersistenceError>;

  restore(backup: DataWalletBackup): ResultAsync<void, PersistenceError>;
  getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError>;

  getRendered(
    force?: boolean,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
  popRendered(
    id: DataWalletBackupID,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;

  unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
