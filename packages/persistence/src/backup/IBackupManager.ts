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
  JSONString,
  BackupError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupManager {
  /**
   * This method adds a new or updated record for the purposes of making an incremental backup.
   * 
   * @param tableName
   * @param value
   */
  addRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError>;

  /**
   * This methods registers a new value for a field for the purposes of doing an incremental backup.
   * 
   * @param key
   * @param value
   * @param force This will force the value to generate a backup even if it hasn't changed.
   */
  updateField(
    key: EFieldKey,
    value: SerializedObject,
    force?: boolean,
  ): ResultAsync<void, PersistenceError>;

  restore(backup: DataWalletBackup): ResultAsync<void, PersistenceError>;
  getRestored(): ResultAsync<RestoredBackup[], PersistenceError>;

  getRendered(
    force?: boolean,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

  /**
   * Marks a backup from getRendered() as having been restored.
   * @param id
   */
  markRenderedChunkAsRestored(
    id: DataWalletBackupID,
  ): ResultAsync<void, PersistenceError>;

  /**
   * Returns the raw data of the backup, unencrypted if necessary
   * @param backup
   */
  unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<JSONString, PersistenceError>;

  /**
   * Resets the status of the backup manager- all chunk managers are cleared and rebuilt
   */
  reset(): ResultAsync<void, BackupError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
