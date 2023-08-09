import {
  EBoolean,
  PersistenceError,
  VersionedObject,
  VolatileStorageDataKey,
  VolatileStorageKey,
  VolatileStorageMetadata,
  VolatileStorageMetadataIndexes,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IndexedDBCursor } from "@persistence/volatile/IndexedDBCursor.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export class IndexedDB {
  private _db?: IDBDatabase;
  private _initialized?: ResultAsync<IDBDatabase, PersistenceError>;
  private _keyPaths: Map<string, string | string[]>;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
    private dbFactory: IDBFactory,
  ) {
    this._keyPaths = new Map();
    this.schema.forEach((x) => {
      this._keyPaths.set(x.name, x.keyPath);
    });
  }

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
          this.schema.forEach((volatileTableIndex) => {
            let keyPath: string | string[];
            if (Array.isArray(volatileTableIndex.keyPath)) {
              keyPath = volatileTableIndex.keyPath.map((x) => {
                return this._getFieldPath(x);
              });
            } else {
              keyPath = this._getFieldPath(volatileTableIndex.keyPath);
            }

            const keyPathObj: IDBObjectStoreParameters = {
              autoIncrement: volatileTableIndex.autoIncrement ?? false,
              keyPath: keyPath,
            };
            const objectStore = db.createObjectStore(
              volatileTableIndex.name,
              keyPathObj,
            );

            VolatileStorageMetadataIndexes.forEach(([name, unique]) => {
              objectStore.createIndex(name, name, { unique: unique });
            });

            if (volatileTableIndex.indexBy) {
              volatileTableIndex.indexBy.forEach(([name, unique]) => {
                if (Array.isArray(name)) {
                  const paths = name.map((x) => this._getFieldPath(x));
                  objectStore.createIndex(
                    this._getCompoundIndexName(paths),
                    paths,
                    {
                      unique: unique,
                    },
                  );
                } else {
                  const path = this._getFieldPath(name);
                  objectStore.createIndex(path, path, { unique: unique });
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

    this._initialized = ResultAsync.fromPromise(promise, (e) => {
      return new PersistenceError("error initializing object store", e);
    }).andThen((db) => {
      this._db = db;
      return this.persist().andThen((persisted) => {
        console.log("IndexDB Persist success: " + persisted);
        return okAsync(db);
      });
    });

    return this._initialized;
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    if (
      typeof navigator === "undefined" ||
      !(navigator.storage && navigator.storage.persist)
    ) {
      console.warn("navigator.storage does not exist not supported");
      return okAsync(false);
    }

    return ResultAsync.fromPromise(navigator.storage.persist(), (e) => {
      return new PersistenceError(
        "Unable to call navigator.storage.persist",
        e,
      );
    });
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

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.initialize(),
      this.getTransaction(name, "readwrite"),
    ]).andThen(([_db, tx]) => {
      const promise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new PersistenceError("timeout"));
        }, 1000);

        try {
          const store = tx.objectStore(name);
          const req = store.clear();
          req.onsuccess = function (evt) {
            clearTimeout(timeout);
            resolve(store);
          };
          req.onerror = function (evt) {
            clearTimeout(timeout);
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
        return this.getTransaction(name, "readwrite");
      })
      .andThen((tx) => {
        const promise = new Promise((resolve, reject) => {
          // console.log("creating promise", obj);
          try {
            const store = tx.objectStore(name);
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
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.getObject<T>(name, key).andThen((found) => {
      if (found == null) {
        return okAsync(null);
      }

      return this.initialize().andThen((db) => {
        return this.getTransaction(name, "readwrite").andThen((tx) => {
          const promise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new PersistenceError("timeout"));
            }, 1000);

            try {
              const store = tx.objectStore(name);
              const request = store.delete(key);
              request.onsuccess = (event) => {
                clearTimeout(timeout);
                resolve(undefined);
              };
              request.onerror = (event) => {
                clearTimeout(timeout);
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
    name: string,
    key: VolatileStorageKey,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(name, "readonly").andThen((tx) => {
        const promise = new Promise((resolve, reject) => {
          const store = tx.objectStore(name);

          const request = store.get(key);

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(new PersistenceError("error reading from object store"));
          };
        });

        return ResultAsync.fromPromise(promise, (e) => {
          return new PersistenceError("error getting object", e);
        }).map((result) => {
          const obj = result as VolatileStorageMetadata<T>;
          if (
            obj != null &&
            (obj.deleted != EBoolean.TRUE || _includeDeleted)
          ) {
            return obj;
          } else {
            return null;
          }
        });
      });
    });
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    index?: VolatileStorageKey,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.initialize().andThen((db) => {
      const indexString = Array.isArray(query);

      return this.getTransaction(name, mode ?? "readonly").andThen((tx) => {
        const store = tx.objectStore(name);
        let request: IDBRequest<IDBCursorWithValue | null>;
        if (index == undefined) {
          request = store.openCursor(query, direction);
        } else {
          const indexObj = store.index(this._getIndexName(index));
          request = indexObj.openCursor(query, direction);
        }

        return okAsync(new IndexedDBCursor<T>(request));
      });
    });
  }

  public getAll<T extends VersionedObject>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(name, "readonly").andThen((tx) => {
        const promise = new Promise<VolatileStorageMetadata<T>[]>(
          (resolve, reject) => {
            const store = tx.objectStore(name);
            let request: IDBRequest<VolatileStorageMetadata<T>[]>;
            if (index == undefined) {
              const indexObj: IDBIndex = store.index("deleted");
              request = indexObj.getAll(EBoolean.FALSE);
            } else {
              // const indexObj: IDBIndex = store.index(this._getIndexName(index));
              // request = indexObj.getAll(query);
              // TODO: fix when we go to SQLite
              throw new PersistenceError(
                "getting all by index query no longer supported",
              );
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

  public getAllByIndex<T extends VersionedObject>(
    name: string,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(name, "readonly").andThen((tx) => {
        const promise = new Promise<VolatileStorageMetadata<T>[]>(
          (resolve, reject) => {
            const store = tx.objectStore(name);
            // let request: IDBRequest<VolatileStorageMetadata<T>[]>;
            const indexObj: IDBIndex = store.index(this._getIndexName(index));
            const request = indexObj.getAll(query);

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
        ).map((result) => {
          return result.filter((x) => {
            return x.deleted == EBoolean.FALSE;
          });
        });
      });
    });
  }

  public getAllKeys<T>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getTransaction(name, "readonly").andThen((tx) => {
        const promise = new Promise<T[]>((resolve, reject) => {
          const store = tx.objectStore(name);
          let request: IDBRequest<any[]>;
          if (index == undefined) {
            const indexObj: IDBIndex = store.index("deleted");
            request = indexObj.getAllKeys(EBoolean.FALSE, count);
          } else {
            throw new PersistenceError(
              "getting keys by index query no longer supported",
            );
            // const indexObj: IDBIndex = store.index(this._getIndexName(index));
            // request = indexObj.getAllKeys(query, count);
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

  public getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey, PersistenceError> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyPath = this._keyPaths.get(tableName);

    if (keyPath == undefined) {
      return errAsync(new PersistenceError("invalid table name"));
    }

    // I can't for the life of me figure out what's going on here.
    // if (keyPath == VolatileTableIndex.DEFAULT_KEY) {
    //   return okAsync(null);
    // }

    try {
      if (Array.isArray(keyPath)) {
        const ret: VolatileStorageKey[] = [];
        keyPath.forEach((item) => {
          ret.push(this._getRecursiveKey(obj, item));
        });

        return okAsync(ret);
      } else {
        return okAsync(this._getRecursiveKey(obj, keyPath));
      }
    } catch (e) {
      return errAsync(
        new PersistenceError("error extracting key from object", e),
      );
    }
  }

  private _getRecursiveKey(obj: object, path: string): string | number {
    const items = path.split(".");
    let ret = obj;
    items.forEach((x) => {
      ret = ret[x];
    });

    return ret as unknown as string | number;
  }

  private _getCompoundIndexName(key: (string | number)[]): string {
    return key.join(",");
  }

  private _getFieldPath(name: VolatileStorageKey): string {
    return [VolatileStorageDataKey, name.toString()].join(".");
  }

  private _getIndexName(index: VolatileStorageKey): string {
    if (Array.isArray(index)) {
      const paths = index.map((x) => this._getFieldPath(x));
      return this._getCompoundIndexName(paths);
    }
    return this._getFieldPath(index);
  }
}
