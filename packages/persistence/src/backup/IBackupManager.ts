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
  dump(): ResultAsync<IDataWalletBackup, PersistenceError>;
  restore(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  popBackup(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
