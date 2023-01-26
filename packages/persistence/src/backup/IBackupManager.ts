import {
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface IBackupManager {
  clear(): ResultAsync<void, never>;

  /**
   * addRecord adds a value to VolatileStorage, which is the database-based storage system.
   * @param tableName
   * @param value
   */
  addRecord(
    tableName: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;
  updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;
  restore(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  popBackup(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError>;
}

export const IBackupManagerType = Symbol.for("IBackupManager");
