import {
  BackupFileName,
  DataWalletBackupID,
  EBackupPriority,
  EFieldKey,
  ERecordKey,
  EVMPrivateKey,
  DataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  AuthenticatedStorageSettings,
} from "@snickerdoodlelabs/objects";
import { IVolatileCursor } from "@snickerdoodlelabs/persistence";
import { ResultAsync } from "neverthrow";

/**
 * This is technically a repository, but since the form factor may need to override where
 * data is put, we hoist it into the objects package.
 * Hopefully, we can just have a single implementation of this that uses perhaps Ceramic
 * and/or IPFS to hold all the data, but in the meantime, we may need local storage versions.
 *
 *
 */
export interface IDataWalletPersistence {
  /**
   * This method is called on the IDataWalletPersistence after the data wallet's derived
   * key is determined. All other methods should not return UNTIL after unlock is complete.
   * This means that if I call addAccount() before unlock(), addAccount() should not resolve,
   * indefinately. Once unlock() is complete, the outstanding call to addAccount() can continue.
   * This is trivially implemented internally by maintaining a consistent unlocked ResultAsync,
   * and using "return this.unlocked.andThen()" at the beginning of the other methods.
   * @param dataWalletKey
   */
  unlock(dataWalletKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;
  waitForUnlock(): ResultAsync<EVMPrivateKey, never>;
  activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
  deactivateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;

  // #region Records
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
  /**
   * This returns the value of a field directly from the authenticated storage.
   * Normally you should use getField(), this occasionally you need to check the
   * backed up value against your current volatile storage value.
   * @param fieldKey
   */
  getFieldFromAuthenticatedStorage<T>(
    fieldKey: EFieldKey,
  ): ResultAsync<T | null, PersistenceError>;
  // #endregion

  // #region Backup Methods
  /**
   * Restores a backup directly to the data wallet. This should only be called for test purposes.
   * Normally, you should use pollBackups().
   * @param backup
   */
  restoreBackup(backup: DataWalletBackup): ResultAsync<void, PersistenceError>;
  pollBackups(): ResultAsync<void, PersistenceError>;
  postBackups(
    force?: boolean,
  ): ResultAsync<DataWalletBackupID[], PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;

  unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError>;

  listFileNames(): ResultAsync<BackupFileName[], PersistenceError>;
  fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;
  // #endregion

  // #region Volatile Storage Methods
  clearVolatileStorage(): ResultAsync<void, PersistenceError>;
  // #endregion
}

export const IDataWalletPersistenceType = Symbol.for("IDataWalletPersistence");
