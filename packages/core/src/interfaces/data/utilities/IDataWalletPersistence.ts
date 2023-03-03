import {
  DataWalletBackupID,
  EBackupPriority,
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
  RestoredBackup,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import {
  EFieldKey,
  ERecordKey,
  IVolatileCursor,
} from "@snickerdoodlelabs/persistence";
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
   * @param derivedKey
   */
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;
  waitForUnlock(): ResultAsync<EVMPrivateKey, never>;

  // write methods
  updateRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;
  updateField(
    key: EFieldKey,
    value: object,
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError>;

  // read methods
  getField<T>(
    key: EFieldKey,
    priority?: EBackupPriority,
  ): ResultAsync<T | null, PersistenceError>;
  getObject<T extends VersionedObject>(
    name: ERecordKey,
    key: VolatileStorageKey,
    priority?: EBackupPriority,
  ): ResultAsync<T | null, PersistenceError>;
  getCursor<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
    priority?: EBackupPriority,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError>;
  getAllKeys<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError>;

  // backup methods
  restoreBackup(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  pollBackups(): ResultAsync<void, PersistenceError>;
  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;
  waitForInitialRestore(): ResultAsync<EVMPrivateKey, never>;
  waitForFullRestore(): ResultAsync<EVMPrivateKey, never>;
  fetchBackupChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError>;

  getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError>;
  restoreBackups(): ResultAsync<
    VolatileStorageMetadata<RestoredBackup>[],
    PersistenceError
  >;
  fetchBackups(
    backupHeader: string,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;
}

export const IDataWalletPersistenceType = Symbol.for("IDataWalletPersistence");
