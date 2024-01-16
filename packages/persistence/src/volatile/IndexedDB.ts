import { ILogUtils } from "@snickerdoodlelabs/common-utils";
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
  private _initialized?: ResultAsync<IDBDatabase, PersistenceError>;
  private _keyPaths: Map<string, string | string[]>;
  private timeoutMS = 5000;

  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
    private dbFactory: IDBFactory,
    protected logUtils: ILogUtils,
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
        reject(
          new PersistenceError(
            `The IndexDB initialization took longer than ${this.timeoutMS} milliseconds; aborting initialization`,
          ),
        );
      }, this.timeoutMS);

      try {
        const request = this.dbFactory.open(this.name);

        request.onsuccess = (_ev) => {
          resolve(request.result);
        };
        request.onerror = (evt: Event) => {
          reject(
            new PersistenceError(
              "Error occurred while opening IndexDB during initialization. onerror event generated",
              evt,
            ),
          );
        };
        request.onupgradeneeded = (event: Event) => {
          this.logUtils.debug("IndexDB requires an upgrade", event);
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
        this.logUtils.error(e);
        clearTimeout(timeout);
        reject(
          new PersistenceError(
            `Error occurred while opening IndexDB during initialization. Exception thrown: ${
              (e as Error).message
            })}`,
            e,
          ),
        );
      }
    });

    this._initialized = ResultAsync.fromPromise(promise, (e) => {
      // We know that the promise rejects with a PersistenceError
      return e as PersistenceError;
    }).andThen((db) => {
      return this.persist().andThen((persisted) => {
        this.logUtils.debug("IndexDB Persist success: " + persisted);
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
      this.logUtils.warning("navigator.storage does not exist not supported");
      return okAsync(false);
    }

    return ResultAsync.fromPromise(navigator.storage.persist(), (e) => {
      return new PersistenceError(
        "Unable to call navigator.storage.persist",
        e,
      );
    });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return this.initialize()
      .andThen((db) => {
        const objectStoreNames = [...db.objectStoreNames];
        this.logUtils.log(
          `Clearing local IndexDB, object store names: ${objectStoreNames}`,
        );
        return this.getTransaction(objectStoreNames, "readwrite").andThen(
          (tx) => {
            return ResultUtils.combine(
              objectStoreNames.map((objectStoreName) => {
                return this._clearNamedObjectStore(tx, objectStoreName);
              }),
            );
          },
        );
      })
      .map(() => {});
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.initialize(),
      this.getTransaction(name, "readwrite"),
    ]).andThen(([_db, tx]) => {
      return this._clearNamedObjectStore(tx, name);
    });
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    if (obj == null) {
      this.logUtils.warning("null object placed in volatile store");
      return okAsync(undefined);
    }

    return this.initialize()
      .andThen((db) => {
        return this.getTransaction(name, "readwrite");
      })
      .andThen((tx) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const store = tx.objectStore(name);
            const request = store.put(obj);
            request.onsuccess = (event) => {
              resolve(undefined);
            };
            request.onerror = (event) => {
              this.logUtils.error(
                `Error occurred in IndexDB in putObject for table ${name}`,
                event,
              );
              reject(
                new PersistenceError(
                  `Error occurred in IndexDB in putObject for table ${name}`,
                  event,
                ),
              );
            };
          } catch (e) {
            tx.abort();
            reject(new PersistenceError("Error updating object store", e));
          }
        });

        return ResultAsync.fromPromise(promise, (e) => {
          // Error coming from the promise is already a PersistenceError
          return e as PersistenceError;
        });
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
              reject(
                new PersistenceError(
                  `Unable to remove an object from IndexDB table ${name} with key ${key} within ${"timeout"} milliseconds`,
                ),
              );
            }, this.timeoutMS);

            try {
              const store = tx.objectStore(name);
              const request = store.delete(key);
              request.onsuccess = (event) => {
                clearTimeout(timeout);
                resolve(undefined);
              };
              request.onerror = (event) => {
                clearTimeout(timeout);
                reject(
                  new PersistenceError(
                    `Unable to remove an object from IndexDB table ${name} with key ${key}. Error event returned.`,
                    event,
                  ),
                );
              };
            } catch (e) {
              clearTimeout(timeout);
              tx.abort();
              reject(
                new PersistenceError(
                  `Unable to remove an object from IndexDB table ${name} with key ${key}. Exception thrown.`,
                  e,
                ),
              );
            }
          });

          return ResultAsync.fromPromise(promise, (e) => {
            // No need to wrap the error, the promise rejects with a PersistenceError
            return e as PersistenceError;
          }).andThen(() => okAsync(found));
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
          // The promise is rejecting with a PersistenceError
          return e as PersistenceError;
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
    storeName: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.initialize().andThen(() => {
      return this.getTransaction(storeName, "readonly").andThen((tx) => {
        const promise = new Promise<VolatileStorageMetadata<T>[]>(
          (resolve, reject) => {
            const store = tx.objectStore(storeName);
            const indexObj: IDBIndex = store.index("deleted");
            const request = indexObj.getAll(EBoolean.FALSE);

            request.onsuccess = (event) => {
              resolve(request.result);
            };
            request.onerror = (event) => {
              reject(
                new PersistenceError(
                  `In IndexedDB, error received in getAll() for schema ${storeName}`,
                ),
              );
            };
          },
        );

        return ResultAsync.fromPromise(promise, (e) => {
          // This is OK here, since we know what the promise above is returning
          // error-wise, no need to re-wrap the error
          return e as PersistenceError;
        });
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
            const indexObj: IDBIndex = store.index(this._getIndexName(index));
            const request = indexObj.getAll(query);

            request.onsuccess = (event) => {
              resolve(request.result);
            };
            request.onerror = (event) => {
              reject(
                new PersistenceError(
                  `In IndexedDB, error received in getAllByIndex() for schema ${name} and index ${index}`,
                ),
              );
            };
          },
        );

        return ResultAsync.fromPromise(promise, (e) => {
          // This is OK here, since we know what the promise above is returning
          // error-wise, no need to re-wrap the error
          return e as PersistenceError;
        }).map((result) => {
          // Need to manually remove deleted items here, since we're not using the deleted index.
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

            request.onsuccess = (event) => {
              resolve(request.result);
            };
            request.onerror = (event) => {
              reject(
                new PersistenceError(
                  `An error occurred while getting all keys from the IndexDB for table ${name}. onerror event generated.`,
                  event,
                ),
              );
            };
          } else {
            reject(
              new PersistenceError(
                "In IndexDB, getting keys by index query no longer supported",
              ),
            );
            // const indexObj: IDBIndex = store.index(this._getIndexName(index));
            // request = indexObj.getAllKeys(query, count);
          }
        });

        return ResultAsync.fromPromise(promise, (e) => {
          return e as PersistenceError;
        }).andThen((keys) => {
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
      return errAsync(
        new PersistenceError(
          `An error occurred in IndexDB on table ${tableName}. The keypath for the object is invalid`,
          obj,
        ),
      );
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
        new PersistenceError(
          `An error occurred in IndexDB on table ${tableName} while getting the key from object. Exception thrown.`,
          e,
        ),
      );
    }
  }

  protected _clearNamedObjectStore(
    tx: IDBTransaction,
    name: string,
  ): ResultAsync<void, PersistenceError> {
    this.logUtils.log(`Clearing object store ${name}`);
    const promise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new PersistenceError(
            `Timeout occurred while clearing object store ${name}. Unable to complete operation within ${this.timeoutMS} milliseconds.`,
          ),
        );
      }, this.timeoutMS);

      try {
        const store = tx.objectStore(name);
        const req = store.clear();
        req.onsuccess = function (evt) {
          clearTimeout(timeout);
          resolve();
        };
        req.onerror = function (evt) {
          clearTimeout(timeout);
          reject(
            new PersistenceError(
              `Error clearing object store ${name}. onError event generated.`,
              evt,
            ),
          );
        };
      } catch (e) {
        clearTimeout(timeout);
        reject(
          new PersistenceError(
            `Error clearing object store ${name}. Exception thrown.`,
            e,
          ),
        );
      }
    });

    return ResultAsync.fromPromise(promise, (e) => {
      return e as PersistenceError;
    });
  }

  protected getTransaction(
    storeNames: string | Iterable<string>,
    mode: IDBTransactionMode,
  ): ResultAsync<IDBTransaction, PersistenceError> {
    return this.initialize().andThen((db) => {
      try {
        const tx = db.transaction(storeNames, mode);
        return okAsync(tx);
      } catch (error) {
        return errAsync(new PersistenceError("Object store does not exist ! "));
      }
    });
  }

  protected _getRecursiveKey(obj: object, path: string): string | number {
    const items = path.split(".");
    let ret = obj;
    items.forEach((x) => {
      ret = ret[x];
    });

    return ret as unknown as string | number;
  }

  protected _getCompoundIndexName(key: (string | number)[]): string {
    return key.join(",");
  }

  protected _getFieldPath(name: VolatileStorageKey): string {
    return [VolatileStorageDataKey, name.toString()].join(".");
  }

  protected _getIndexName(index: VolatileStorageKey): string {
    if (Array.isArray(index)) {
      const paths = index.map((x) => this._getFieldPath(x));
      return this._getCompoundIndexName(paths);
    }
    return this._getFieldPath(index);
  }
}
