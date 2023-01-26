import { PersistenceError } from "@snickerdoodlelabs/objects";
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

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    return this.indexedDB.initialize();
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return this.indexedDB.persist();
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return this.indexedDB.clearObjectStore(name);
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    return this.indexedDB.putObject(name, obj);
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    return this.indexedDB.removeObject(name, key);
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    return this.indexedDB
      .getObject<T>(name, key)
      .map((x) => (x == null ? null : x.data));
  }

  public getCursor<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.indexedDB.getCursor(name, indexName, query, direction, mode);
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    return this.indexedDB.getAll<T>(name, indexName).map((values) => {
      return values.map((x) => x.data);
    });
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
