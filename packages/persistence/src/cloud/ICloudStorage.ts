import {
  PersistenceError,
  DataWalletBackup,
  EVMPrivateKey,
  DataWalletBackupID,
  BackupFileName,
  StorageKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  /**
   * Stores a new backup file in the cloud
   * @param backup The backup you want to store in the cloud
   */
  putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;

  /**
   * This returns a list of backups that exist in the cloud, excluding those
   * listed in the "restored" parameter
   * @param restored This is a set of backup IDs that have been restored from the cloud
   */
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  /**
   * Returns all the backups for a specific storage type, excluding those
   * listed in the "restored" parameter.
   * @param restored This is a set of backup IDs that have been restored from the cloud
   * @param recordKey The kind of backup you are looking for
   */
  pollByStorageType(
    restored: Set<DataWalletBackupID>,
    recordKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

  /**
   * Returns the latest backup for a specific storage type, if any exists.
   * Returns null otherwise.
   * @param storageKey The kind of backup you are looking for
   */
  getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError>;

  /**
   * This is the nuclear option; it clears all the backups
   */
  clear(): ResultAsync<void, PersistenceError>;

  /**
   * Returns a list of all the backup file names
   */
  listFileNames(): ResultAsync<BackupFileName[], PersistenceError>;

  /**
   * Returns a specific backup
   * @param backupHeader The header of the backup you want to fetch
   */
  fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
