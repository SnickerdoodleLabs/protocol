import {
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IndexedDB } from "@persistence/volatile/IndexedDB.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { volatileStorageSchema } from "@persistence/volatile/VolatileStorageSchema.js";

@injectable()
export class IndexedDBVolatileStorage implements IVolatileStorage {
  protected indexedDB: IndexedDB;

  public constructor() {
    this.indexedDB = new IndexedDB(
      "SD_Wallet",
      volatileStorageSchema,
      indexedDB,
    );
  }

  public getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    return this.indexedDB.getKey(tableName, obj);
  }

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    return this.indexedDB.initialize();
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return this.indexedDB.persist();
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return this.indexedDB.clearObjectStore(name);
  }

  public putObject<T extends VersionedObject>(
    name: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this.indexedDB.putObject(name, obj);
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    return this.indexedDB.removeObject(name, key);
  }

  public getObject<T extends VersionedObject>(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.indexedDB.getObject<T>(name, key);
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.indexedDB.getCursor(name, indexName, query, direction, mode);
  }

  public getAll<T extends VersionedObject>(
    name: string,
    indexName?: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.indexedDB.getAll<T>(name, indexName);
  }

  getAllByIndex<T extends VersionedObject>(
    name: string,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.indexedDB.getAllByIndex<T>(name, index, query);
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.indexedDB.getAllKeys(name, indexName, query, count);
  }
}
