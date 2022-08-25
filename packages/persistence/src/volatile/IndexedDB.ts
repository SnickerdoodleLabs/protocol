import { PersistenceError } from "@snickerdoodlelabs/objects";
import { indexedDB as fakeIndexedDB, IDBKeyRange } from "fake-indexeddb";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IVolatileStorageFactory } from "@persistence/volatile/IVolatileStorageFactory";
import {
  VolatileTableConfig,
  IVolatileStorageTable,
  VolatileTableIndex,
  IVolatileCursor,
} from "@persistence/volatile/IVolatileStorageTable";

@injectable()
export class IndexedDBFactory implements IVolatileStorageFactory {
  getStore(
    config: VolatileTableConfig,
  ): ResultAsync<IVolatileStorageTable, PersistenceError> {
    return okAsync(new IndexedDB(config.name, config.schema));
  }
}

export class IndexedDB implements IVolatileStorageTable {
  private _db?: IDBDatabase;
  private _initialized = false;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex[],
  ) {}

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._initialized) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(this._db!);
    }

    const idb = this._getIDBFactory();

    const schema = this.schema;
    const request = idb.open(this.name);
    const promise = new Promise<IDBDatabase>(function (resolve, reject) {
      request.onsuccess = (_ev) => {
        resolve(request.result);
      };
      request.onerror = (_ev: Event) => {
        reject(new PersistenceError("error loading db"));
      };
      request.onupgradeneeded = (event: Event) => {
        const db = request.result;
        schema.forEach((storeInfo) => {
          const keyPathObj: IDBObjectStoreParameters = {
            autoIncrement: storeInfo.autoIncrement ?? false,
            keyPath: storeInfo.keyPath,
          };
          const objectStore = db.createObjectStore(storeInfo.name, keyPathObj);
          storeInfo.indexBy?.forEach(([name, unique]) => {
            objectStore.createIndex(name, name, { unique: unique });
          });
        });
      };
    });

    return ResultAsync.fromPromise(
      promise,
      (e) => e as PersistenceError,
    ).andThen((db) => {
      this._db = db;
      this._initialized = true;
      return this.persist().andThen((persisted) => {
        //console.log("Local storage persisted: " + persisted);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return okAsync(this._db!);
      });
    });
  }

  private _getIDBFactory(): IDBFactory {
    if (typeof indexedDB === "undefined") {
      return fakeIndexedDB;
    }
    return indexedDB;
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    if (
      typeof navigator === "undefined" ||
      !(navigator.storage && navigator.storage.persist)
    ) {
      return okAsync(false);
    }

    return ResultAsync.fromPromise(
      navigator.storage.persist(),
      (e) => new PersistenceError(JSON.stringify(e)),
    );
  }

  private getObjectStore(
    name: string,
    mode: IDBTransactionMode,
  ): ResultAsync<IDBObjectStore, PersistenceError> {
    return this.initialize().andThen((db) => {
      const tx = db.transaction(name, mode);
      return okAsync(tx.objectStore(name));
    });
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.initialize(),
      this.getObjectStore(name, "readwrite"),
    ]).andThen(([_db, store]) => {
      const req = store.clear();
      const promise = new Promise(function (resolve, reject) {
        req.onsuccess = function (evt) {
          resolve(store);
        };
        req.onerror = function (evt) {
          reject(new PersistenceError("error clearing object store"));
        };
      });

      return ResultAsync.fromPromise(
        promise,
        (e) => e as PersistenceError,
      ).andThen((_store) => okAsync(undefined));
    });
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readwrite").andThen((store) => {
        const request = store.put(obj);
        const promise = new Promise(function (resolve, reject) {
          request.onsuccess = (event) => {
            resolve(undefined);
          };
          request.onerror = (event) => {
            console.log(name, obj, event.target);
            reject(
              new PersistenceError(
                "error updating object store: " + event.target,
              ),
            );
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => e as PersistenceError,
        ).andThen(() => okAsync(undefined));
      });
    });
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readwrite").andThen((store) => {
        const request = store.delete(key);
        const promise = new Promise(function (resolve, reject) {
          request.onsuccess = (event) => {
            resolve(undefined);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error updating object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => e as PersistenceError,
        ).andThen(() => okAsync(undefined));
      });
    });
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readonly").andThen((store) => {
        const request = store.get(key);
        const promise = new Promise(function (resolve, reject) {
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => e as PersistenceError,
        ).andThen((result) => okAsync(result as T));
      });
    });
  }

  public getCursor<T>(
    name: string,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IndexedDBCursor<T>, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, mode ?? "readonly").andThen((store) => {
        let request: IDBRequest<IDBCursorWithValue | null>;
        if (indexName == undefined) {
          request = store.openCursor(query, direction);
        } else {
          const index: IDBIndex = store.index(indexName);
          request = index.openCursor(query, direction);
        }

        return okAsync(new IndexedDBCursor<T>(request));
      });
    });
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readonly").andThen((store) => {
        let request: IDBRequest<any[]>;
        if (indexName == undefined) {
          request = store.getAll();
        } else {
          const index: IDBIndex = store.index(indexName);
          request = index.getAll();
        }

        const promise = new Promise<T[]>(function (resolve, reject) {
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(promise, (e) => e as PersistenceError);
      });
    });
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readonly").andThen((store) => {
        let request: IDBRequest<any[]>;
        if (indexName == undefined) {
          request = store.getAllKeys(query, count);
        } else {
          const index: IDBIndex = store.index(indexName);
          request = index.getAllKeys(query, count);
        }

        const promise = new Promise<T[]>(function (resolve, reject) {
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => e as PersistenceError,
        ).andThen((keys) => {
          return okAsync(keys as T[]);
        });
      });
    });
  }
}

export class IndexedDBCursor<T> implements IVolatileCursor<T> {
  private _cursor: IDBCursorWithValue | null = null;

  public constructor(
    protected request: IDBRequest<IDBCursorWithValue | null>,
  ) {}

  public nextValue(): ResultAsync<T | null, PersistenceError> {
    const promise = new Promise<T | null>((resolve, reject) => {
      this.request.onsuccess = (event) => {
        this._cursor = this.request.result;

        if (!this._cursor) {
          resolve(null);
        } else {
          resolve(this._cursor.value as T);
        }
      };

      this.request.onerror = (event) => {
        reject(new PersistenceError("error reading cursor: " + event.target));
      };
    });

    this._cursor?.continue();
    return ResultAsync.fromPromise(promise, (e) => e as PersistenceError);
  }
}
