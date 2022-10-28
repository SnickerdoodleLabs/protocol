import { PersistenceError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ELocalStorageKey } from "@persistence/ELocalStorageKey.js";
import { IndexedDB } from "@persistence/volatile/IndexedDB.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

@injectable()
export class IndexedDBVolatileStorage implements IVolatileStorage {
  protected indexedDB: IndexedDB;

  public constructor() {
    this.indexedDB = new IndexedDB("SD_Wallet", [
      new VolatileTableIndex(
        ELocalStorageKey.ACCOUNT,
        "sourceAccountAddress",
        false,
        [["sourceChain", false]],
      ),
      new VolatileTableIndex(ELocalStorageKey.TRANSACTIONS, "hash", false, [
        ["timestamp", false],
        ["chainId", false],
        ["value", false],
        ["to", false],
        ["from", false],
      ]),
      new VolatileTableIndex(ELocalStorageKey.SITE_VISITS, "id", true, [
        ["url", false],
        ["startTime", false],
        ["endTime", false],
      ]),
      new VolatileTableIndex(ELocalStorageKey.CLICKS, "id", true, [
        ["url", false],
        ["timestamp", false],
        ["element", false],
      ]),
      new VolatileTableIndex(ELocalStorageKey.LATEST_BLOCK, "contract", false),
      new VolatileTableIndex(
        ELocalStorageKey.EARNED_REWARDS,
        "queryCID",
        false,
        [["type", false]],
      ),
    ]);
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
    return this.indexedDB.getObject(name, key);
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
    return this.indexedDB.getAll(name, indexName);
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
