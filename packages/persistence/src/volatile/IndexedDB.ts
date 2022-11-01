import { PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IndexedDBCursor } from "@persistence/volatile/IndexedDBCursor.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export class IndexedDB {
  private _db?: IDBDatabase;
  private _initialized?: ResultAsync<IDBDatabase, PersistenceError>;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex[],
    private dbFactory: IDBFactory,
  ) {}

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._initialized) {
      return this._initialized;
    }

    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = this.dbFactory.open(this.name);

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
    )
      .andThen((db) => {
        this._db = db;
        return this.persist();
      })
      .andThen((persisted) => {
        console.log("Local storage persisted: " + persisted);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return okAsync(this._db!);
      });

    return this._initialized;
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
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
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
          let request: IDBRequest<T[]>;
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
