import {
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupManager {
  clear(): ResultAsync<void, never>;
  addRecord(
    tableName: string,
    value: object,
  ): ResultAsync<void, PersistenceError>;
  updateField(key: string, value: object): ResultAsync<void, PersistenceError>;
  restore(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  popBackup(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
