import {
  DataWalletBackupID,
  DataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
  ERecordKey,
  EFieldKey,
  RestoredBackup,
  SerializedObject,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

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
    value: SerializedObject,
  ): ResultAsync<void, PersistenceError>;

  restore(backup: DataWalletBackup): ResultAsync<void, PersistenceError>;
  getRestored(): ResultAsync<RestoredBackup[], PersistenceError>;

  getRendered(
    force?: boolean,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
  popRendered(id: DataWalletBackupID): ResultAsync<void, PersistenceError>;

  unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
