import {
  BackupFileName,
  DataWalletBackupID,
  EBackupPriority,
  EFieldKey,
  ERecordKey,
  DataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  AuthenticatedStorageSettings,
  BackupError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export interface IPersistence {
  getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError>;
  getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError>;
  getAllByIndex<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName: string,
    query: IDBValidKey | IDBKeyRange,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError>;
  getAllKeys<T extends VersionedObject>(
    recordKey: ERecordKey,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;
  updateRecord<T extends VersionedObject>(
    recordKey: ERecordKey,
    value: T,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError>;
  // #endregion

  // #region Fields
  getField<T>(fieldKey: EFieldKey): ResultAsync<T | null, PersistenceError>;
  updateField(
    fieldKey: EFieldKey,
    value: object,
  ): ResultAsync<void, PersistenceError>;
}

export const IPersistenceType = Symbol.for("IPersistence");
