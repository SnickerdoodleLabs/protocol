import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  DataWalletBackupID,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError>;

  fetchBackups(
    backupHeader: string,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
