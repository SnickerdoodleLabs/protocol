import { PersistenceError } from "@snickerdoodlelabs/objects";
import {
  indexedDB as fakeIndexedDB,
  IDBKeyRange as fakeIDBKeyRange,
} from "fake-indexeddb";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IVolatileStorageFactory } from "@persistence/volatile/IVolatileStorageFactory.js";
import {
  VolatileTableConfig,
  IVolatileStorageTable,
  VolatileTableIndex,
  IVolatileCursor,
} from "@persistence/volatile/IVolatileStorageTable.js";

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
  private _initialized?: ResultAsync<IDBDatabase, PersistenceError>;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex[],
  ) {}

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._initialized) {
      return this._initialized;
    }
    const idb = this._getIDBFactory();
    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = idb.open(this.name);

        request.onsuccess = (_ev) => {
          resolve(request.result);
        };
        request.onerror = (_ev: Event) => {
          reject(new PersistenceError("error loading db"));
        };
        request.onupgradeneeded = (event: Event) => {
          const db = request.result;
          this.schema.forEach((storeInfo) => {
            const keyPathObj: IDBObjectStoreParameters = {
              autoIncrement: storeInfo.autoIncrement ?? false,
              keyPath: storeInfo.keyPath,
            };
            const objectStore = db.createObjectStore(
              storeInfo.name,
              keyPathObj,
            );
            storeInfo.indexBy?.forEach(([name, unique]) => {
              objectStore.createIndex(name, name, { unique: unique });
            });
          });
        };
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

    this._initialized = ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error initializing object store", e),
    ).andThen((db) => {
      this._db = db;
      return this.persist().andThen((persisted) => {
        console.log("Local storage persisted: " + persisted);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return okAsync(this._db!);
      });
    });

    return this._initialized;
  }

  private _getIDBFactory(): IDBFactory {
    if (typeof indexedDB === "undefined") {
      return fakeIndexedDB;
    }
    return indexedDB;
  }

  private _getIDBKeyRange(query: string | number): IDBKeyRange {
    if (typeof indexedDB === "undefined") {
      return fakeIDBKeyRange.only(query);
    }
    return IDBKeyRange.only(query);
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
      const promise = new Promise((resolve, reject) => {
        const req = store.clear();
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
    if (obj == null) {
      console.warn("null object placed in volatile store");
      return okAsync(undefined);
    }

    return this.initialize()
      .andThen((db) => {
        return this.getObjectStore(name, "readwrite");
      })
      .andThen((store) => {
        const promise = new Promise((resolve, reject) => {
          // console.log("creating promise", obj);
          try {
            const timeout = setTimeout(() => {
              reject(new PersistenceError("timeout"));
            }, 1000);
            const request = store.put(obj);
            request.onsuccess = (event) => {
              clearTimeout(timeout);
              resolve(undefined);
            };
            request.onerror = (event) => {
              console.log("err", event);
              clearTimeout(timeout);
              reject(
                new PersistenceError(
                  "error updating object store: " + event.target,
                ),
              );
            };
          } catch (e) {
            console.log("error obj", obj);
            console.error("error", e);
            reject(new PersistenceError("Error updating object store", e));
          }
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error placing object", e),
        );
      })
      .map(() => {});
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readwrite").andThen((store) => {
        const promise = new Promise((resolve, reject) => {
          const request = store.delete(key);
          request.onsuccess = (event) => {
            resolve(undefined);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error updating object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error removing object", e),
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
        const promise = new Promise((resolve, reject) => {
          const request = store.get(key);
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error getting object", e),
        ).andThen((result) => okAsync(result as T));
      });
    });
  }

  public getCursor<T>(
    name: string,
    indexName?: string,
    query?: string | number,
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
        const promise = new Promise<T[]>((resolve, reject) => {
          let request: IDBRequest<any[]>;
          if (indexName == undefined) {
            request = store.getAll();
          } else {
            const index: IDBIndex = store.index(indexName);
            request = index.getAll();
          }

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error getting all", e),
        );
      });
    });
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readonly").andThen((store) => {
        const promise = new Promise<T[]>((resolve, reject) => {
          let request: IDBRequest<any[]>;
          if (indexName == undefined) {
            request = store.getAllKeys(query, count);
          } else {
            const index: IDBIndex = store.index(indexName);
            request = index.getAllKeys(query, count);
          }

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

  public allValues(): ResultAsync<T[], PersistenceError> {
    return this.nextValue().andThen((val) => {
      if (val == null) {
        return okAsync([]);
      }

      return this.allValues().andThen((vals) => {
        return okAsync([val, ...vals]);
      });
    });
  }
}
