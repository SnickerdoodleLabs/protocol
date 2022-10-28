import {
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupManager {
  clear(): void;

  addRecord(
    tableName: string,
    value: object,
  ): ResultAsync<void, PersistenceError>;

  updateField(key: string, value: object): ResultAsync<void, PersistenceError>;

  getNumUpdates(): ResultAsync<number, never>;

  dump(): ResultAsync<IDataWalletBackup, PersistenceError>;

  restore(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
