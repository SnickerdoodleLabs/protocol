import {
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
  VolatileStorageKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

import { VolatileStorageMetadata } from "..";

export interface IBackupManager {
  clear(): ResultAsync<void, never>;
  addRecord<T>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
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
