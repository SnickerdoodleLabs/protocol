import { ERecordKey } from "@snickerdoodlelabs/objects";
import { VolatileStorageKey } from "@snickerdoodlelabs/objects";
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

  readBeforeUnlock(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError>;

  writeBeforeUnlock(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError>;

  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;
  putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

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

export const IGoogleCloudStorageType = Symbol.for("IGoogleCloudStorage");
export const IDropboxCloudStorageType = Symbol.for("IDropboxCloudStorage");
export const ICloudStorageType = Symbol.for("ICloudStorage");
