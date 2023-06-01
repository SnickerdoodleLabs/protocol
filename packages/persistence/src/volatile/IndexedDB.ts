import {
  EBoolean,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
  ERecordKey,
  VolatileStorageQuery,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IndexedDBCursor } from "@persistence/volatile/IndexedDBCursor.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export class IndexedDB {
  private _db?: IDBDatabase;
  private _initialized?: ResultAsync<IDBDatabase, PersistenceError>;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
    private dbFactory: IDBFactory,
  ) {}

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._initialized) {
      return this._initialized;
    }

    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new PersistenceError("timeout"));
      }, 1000);

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
              keyPath: VolatileTableIndex.DEFAULT_KEY,
            };
            const objectStore = db.createObjectStore(
              storeInfo.name,
              keyPathObj,
            );

            if (storeInfo.indexBy) {
              storeInfo.indexBy.forEach(([name, unique]) => {
                if (Array.isArray(name)) {
                  objectStore.createIndex(
                    this._getCompoundIndexName(name),
                    name,
                    {
                      unique: unique,
                    },
                  );
                } else {
                  objectStore.createIndex(name, name, { unique: unique });
                }
              });
            }
          });
        };
      } catch (e) {
        console.error(e);
        clearTimeout(timeout);
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

  private getTransaction(
    name: string,
    mode: IDBTransactionMode,
  ): ResultAsync<IDBTransaction, PersistenceError> {
    return this.initialize().andThen((db) => {
      return okAsync(db.transaction(name, mode));
      // return okAsync(tx.objectStore(name));
    });
  }

  public clearObjectStore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.initialize(),
      this.getTransaction(recordKey, "readwrite"),
    ]).andThen(([_db, tx]) => {
      const promise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new PersistenceError("timeout"));
        }, 1000);

        try {
          const store = tx.objectStore(recordKey);
          const req = store.clear();
          req.onsuccess = function (evt) {
            clearTimeout(timeout);
            tx.commit();
            resolve(store);
          };
          req.onerror = function (evt) {
            clearTimeout(timeout);
            tx.abort();
            reject(new PersistenceError("error clearing object store"));
          };
        } catch (e) {
          clearTimeout(timeout);
          tx.abort();
          reject(new PersistenceError("error clearing store", e));
        }
      });

      return ResultAsync.fromPromise(
        promise,
        (e) => e as PersistenceError,
      ).andThen((_store) => okAsync(undefined));
    });
  }

  public putObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    if (obj == null) {
      console.warn("null object placed in volatile store");
      return okAsync(undefined);
    }

    return this.initialize()
      .andThen((db) => {
        return this.getTransaction(recordKey, "readwrite");
      })
      .andThen((tx) => {
        const promise = new Promise((resolve, reject) => {
          // console.log("creating promise", obj);
          try {
            const store = tx.objectStore(recordKey);
            const request = store.put(obj);
            request.onsuccess = (event) => {
              resolve(undefined);
            };
            request.onerror = (event) => {
              console.log("err", event);
              reject(
                new PersistenceError(
                  "error updating object store: " + event.target,
                ),
              );
            };
          } catch (e) {
            console.log("error", e, "table", name, "obj", obj);
            tx.abort();
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

  public removeObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<undefined, PersistenceError> {
    return this.getObject<T>(recordKey, key).andThen((found) => {
      if (found == null) {
        return okAsync(null);
      }

      return this.initialize().andThen((db) => {
        return this.getTransaction(recordKey, "readwrite").andThen((tx) => {
          const promise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new PersistenceError("timeout"));
            }, 1000);

            try {
              const store = tx.objectStore(recordKey);
              const request = store.delete(key);
              request.onsuccess = (event) => {
                clearTimeout(timeout);
                tx.commit();
                resolve(undefined);
              };
              request.onerror = (event) => {
                clearTimeout(timeout);
                tx.abort();
                reject(new PersistenceError("error updating object store"));
              };
            } catch (e) {
              clearTimeout(timeout);
              tx.abort();
              reject(new PersistenceError("error removing object", e));
            }
          });

          return ResultAsync.fromPromise(
            promise,
            (e) => new PersistenceError("error removing object", e),
          ).andThen(() => okAsync(found));
        });
      });
    });
  }

  public getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(recordKey, "readonly").andThen((tx) => {
        const promise = new Promise((resolve, reject) => {
          const store = tx.objectStore(recordKey);
          const request = store.get(key);
          request.onsuccess = (event) => {
            tx.commit();
            resolve(request.result);
          };
          request.onerror = (event) => {
            tx.abort();
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error getting object", e),
        ).map((result) => {
          return result as T | null;
        });
      });
    });
  }

  public getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(
        recordKey,
        query?.idbQuery.mode ?? "readonly",
      ).andThen((tx) => {
        const store = tx.objectStore(recordKey);
        let request: IDBRequest<IDBCursorWithValue | null>;
        if (query?.index == undefined) {
          request = store.openCursor(
            query?.idbQuery.query,
            query?.idbQuery.direction,
          );
        } else {
          const indexObj = store.index(
            this._getIndexName(query?.idbQuery.index),
          );
          request = indexObj.openCursor(query, query?.idbQuery.direction);
        }

        return okAsync(new IndexedDBCursor<T>(request));
      });
    });
  }

  public getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(recordKey, "readonly").andThen((tx) => {
        const promise = new Promise<VolatileStorageMetadata<T>[]>(
          (resolve, reject) => {
            const store = tx.objectStore(name);
            let request: IDBRequest<VolatileStorageMetadata<T>[]>;
            if (query?.idbQuery.index == undefined) {
              request = store.getAll();
            } else {
              const indexObj: IDBIndex = store.index(
                this._getIndexName(query?.idbQuery.index),
              );
              request = indexObj.getAll(query);
            }

            request.onsuccess = (event) => {
              resolve(request.result);
            };
            request.onerror = (event) => {
              reject(new PersistenceError("error reading from object store"));
            };
          },
        );

        return ResultAsync.fromPromise(
          promise,
          (e) => new PersistenceError("error getting all", e),
        );
      });
    });
  }

  public getAllKeys<T>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(recordKey, "readonly").andThen((tx) => {
        const promise = new Promise<T[]>((resolve, reject) => {
          const store = tx.objectStore(name);
          let request: IDBRequest<any[]>;
          if (query?.idbIndex.index == undefined) {
            request = store.getAllKeys();
          } else {
            const indexObj: IDBIndex = store.index(
              this._getIndexName(query?.idbIndex.index),
            );
            request = indexObj.getAllKeys(query);
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

  private _getCompoundIndexName(key: (string | number)[]): string {
    return key.join(",");
  }

  private _getIndexName(index: VolatileStorageKey): string {
    if (Array.isArray(index)) {
      return this._getCompoundIndexName(index);
    }
    return index;
  }
}
