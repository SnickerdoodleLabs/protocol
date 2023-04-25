import {
  PersistenceError,
  DataWalletBackup,
  EVMPrivateKey,
  DataWalletBackupID,
  EBackupPriority,
  BackupFileName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError>;

  listFileNames(): ResultAsync<BackupFileName[], PersistenceError>;
  fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
