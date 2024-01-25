import { ILogUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  DatabaseVersion,
  EBoolean,
  ERecordKey,
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
  private _databaseConnection?: IDBDatabase;
  private _keyPaths: Map<string, string | string[] | null>;
  private timeoutMS = 5000;

  // @TODOS:
  // check tests - DataWalletPersistence.test.ts - BackupManager.test.ts
  // add stress tests
  // Update cursor methods, get all .e.g

  // #region promises

  // this map is used to keep track of promises that are used to indicate that a store is being migrated
  // helps prevent data corruption by ensuring proper handling of multiple open transactions on the same store.
  private storePromises: Map<ERecordKey, Promise<undefined>> = new Map();
  // Map containing resolvers for the store migration promises, used to signal completion.
  private storePromiseResolvers: Map<
    ERecordKey,
    (value: PromiseLike<undefined> | undefined) => void
  > = new Map();

  // #endregion promises

  private objectStoresMightNeedMigration: ERecordKey[] = [];

  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
    private dbFactory: IDBFactory,
    protected logUtils: ILogUtils,
    protected timeUtils: ITimeUtils,
    protected databaseVersion: number,
  ) {
    this._keyPaths = new Map();
    this.schema.forEach((x) => {
      this._keyPaths.set(x.name, x.primayKey[0]);
    });
  }

  // #region migration logic

  // Set flag to indicate that a specific object store is being migrated
  private lockStore(storeName: ERecordKey): void {
    const promise = new Promise<undefined>((resolve) => {
      this.logUtils.debug("Locking store", storeName);
      this.storePromiseResolvers.set(storeName, resolve);
    });

    this.storePromises.set(storeName, promise);
  }
  // Unlock a store after migration is complete
  private unlockStore(storeName: ERecordKey): ResultAsync<void, never> {
    const resolver = this.storePromiseResolvers.get(storeName);
    if (resolver) {
      this.logUtils.debug("Unlocking store", storeName);
      resolver(undefined);
    }
    return okAsync(undefined);
  }

  // This function allows us to check if the store has any ongoing operations that could potentially corrupt the data.
  private waitForStore(storeName: ERecordKey): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(
      this.storePromises.get(storeName) ?? Promise.resolve(),
    );
  }

  /**
   * This function acts as a kind of migration table.
   * If it returns multiple versions, it means the store has some data partially migrated.
   * If it returns a single version, it means the store is either not migrated yet or migrated successfully.
   * If it returns undefined, it means the store is empty or the data was stored before the migration logic was implemented.
   * The reason for not using a migration table is that a migration table can also be corrupted during the app's lifetime,
   * or the user can close the app during migration, which would leave the migration table in a corrupted state.
   *
   * @param {IDBObjectStore} objectStore - The IDBObjectStore to check for stored versions.
   * @returns {ResultAsync<number | number[] | undefined, PersistenceError>} - The result containing the stored version(s) or undefined.
   */
  private lookUpStoredVersion(
    objectStore: IDBObjectStore,
  ): ResultAsync<number | number[] | null, PersistenceError> {
    return ResultAsync.fromPromise(
      new Promise((resolve, reject) => {
        const index = objectStore.index("version");
        const uniqueVersions = new Set<number>();
        // To optimize performance, we use openKeyCursor() to exclusively check the index without retrieving the actual data.
        // inspecting the index alone is faster than fetching the complete data.
        const request = index.openKeyCursor();
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursor>).result;
          if (cursor) {
            // Add the version to the set
            uniqueVersions.add(cursor.key as number);
            cursor.continue();
          } else {
            if (uniqueVersions.size > 0) {
              resolve(
                uniqueVersions.size === 1
                  ? uniqueVersions.values().next().value
                  : Array.from(uniqueVersions),
              );
            } else {
              resolve(null);
            }
          }
        };
        request.onerror = (event) => {
          reject(
            new PersistenceError(
              "Could not read version index from object store",
              event,
            ),
          );
        };
      }),
      (e) => new PersistenceError((e as Error).message),
    );
  }

  /**
   * Initiates migration for object stores that might need it.
   * @param {IDBDatabase} db - The IDBDatabase instance to migrate.
   */
  private migrateDB(db: IDBDatabase) {
    const stores =
      this.objectStoresMightNeedMigration.length > 0
        ? this.objectStoresMightNeedMigration
        : this.schema.map((x) => x.name);
    stores.forEach((storeName) => {
      this.migrateStore(storeName, db);
    });
  }
  /**
   * Migrates a specific object store in the database.
   * @param {ERecordKey} storeName - The name of the object store to migrate.
   * @param {IDBDatabase} db - The IDBDatabase instance.
   */

  private migrateStore(storeName: ERecordKey, db: IDBDatabase) {
    this.lockStore(storeName);
    // Get the current version from the schema definition
    const currentMigrator = this.schema.find(
      (st) => st.name == storeName,
    )?.migrator;
    if (currentMigrator == undefined) {
      return this.unlockStore(storeName);
    }
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const startingTime = this.timeUtils.getMillisecondNow();
    tx.oncomplete = (_event) => {
      this.logUtils.debug(
        `Migration function took ${
          (this.timeUtils.getMillisecondNow() - startingTime) / 1000
        } seconds for store ${storeName}`,
      );
      this.unlockStore(storeName);
    };
    tx.onerror = (event) => {
      this.logUtils.error(
        `Error occurred while migrating store ${storeName}`,
        event,
      );
      // We choose not to call tx.abort() here, as having partially migrated data is acceptable.
      // The recovery of partially migrated data is possible through the same migration logic.
      this.unlockStore(storeName);
    };
    return this.lookUpStoredVersion(store).andThen((version) => {
      if (
        Array.isArray(version) ||
        version != currentMigrator.getCurrentVersion()
      ) {
        return ResultAsync.fromPromise(
          new Promise((resolve, reject) => {
            this.logUtils.debug(`Migrating store ${storeName}`);

            const getCursor = store.openCursor();

            getCursor.onsuccess = (_event) => {
              const cursor = getCursor.result;
              if (cursor) {
                const data = cursor.value[VolatileStorageDataKey];
                const version = (cursor.value.version ?? 1) as number;

                const versionedData: VersionedObject =
                  currentMigrator.getCurrent(data, version);
                if (versionedData) {
                  cursor.update({
                    ...cursor.value,
                    [VolatileStorageDataKey]: versionedData,
                    version: currentMigrator.getCurrentVersion(),
                  });
                }
                cursor.continue();
              } else {
                resolve(undefined);
              }
            };
            getCursor.onerror = (event) => {
              // Handle error while iterating through records
              resolve(undefined);
              this.logUtils.error(
                `Error iterating through records during migration for store ${storeName}`,
                event,
              );
            };
          }),
          (e) => e,
        );
      }
      this.logUtils.debug(
        `The store ${storeName} is up to date, no migration needed. Unlocking the store`,
      );
      return okAsync(undefined);
    });
  }

  // #endregion migration logic

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._databaseConnection) {
      return okAsync(this._databaseConnection);
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
        const request = this.dbFactory.open(this.name, this.databaseVersion);

        request.onsuccess = (_ev) => {
          // If there are object stores that potentially need migration, initiate the migration process in the background.
          // This allows the database to be resolved while the migration is concurrently handled to avoid blocking the main thread.
          clearTimeout(timeout);
          this.migrateDB(request.result);
          resolve(request.result);
        };
        request.onerror = (evt: Event) => {
          clearTimeout(timeout);
          reject(
            new PersistenceError(
              "Error occurred while opening IndexDB during initialization. onerror event generated",
              evt,
            ),
          );
        };
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          this.logUtils.debug("IndexDB requires an upgrade", event);
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          const existingObjectStores = Array.from(db.objectStoreNames);
          this.schema.forEach((volatileTableIndex) => {
            const createIndexParamsArray = this._getCreateIndexParamsArray(
              volatileTableIndex.indexBy,
            );
            // If the object store doesn't exist, create it
            if (!existingObjectStores.includes(volatileTableIndex.name)) {
              let objectStoreParams: IDBObjectStoreParameters;
              const [keyPathField, autoIncrement] =
                volatileTableIndex.primayKey;
              if (autoIncrement) {
                objectStoreParams = {
                  autoIncrement: true,
                };
              } else {
                objectStoreParams = {
                  keyPath: Array.isArray(keyPathField)
                    ? keyPathField.map((x) => {
                        return this._getFieldPath(x);
                      })
                    : this._getFieldPath(keyPathField),
                  autoIncrement: false,
                };
              }

              const objectStore = db.createObjectStore(
                volatileTableIndex.name,
                objectStoreParams,
              );

              // Create indexes
              createIndexParamsArray.forEach((params) => {
                objectStore.createIndex(...params);
              });
            } // If the object store exists, check for index changes
            else {
              if (transaction) {
                const objectStore = transaction.objectStore(
                  volatileTableIndex.name,
                );

                const oldIndexes = Array.from(objectStore.indexNames);

                //zaten auto increment varsa , ucur tabloyu yeniden yarat.
                // accepted invitations
                const addedIndexesParams = createIndexParamsArray.filter(
                  ([name]) => !oldIndexes.includes(name),
                );

                const removedIndexNames = oldIndexes.filter(
                  (name) =>
                    !createIndexParamsArray.some(
                      ([currentIndex]) => currentIndex === name,
                    ),
                );

                this.logUtils.debug(
                  `found ${addedIndexesParams.length} index additions for store ${volatileTableIndex.name}`,
                );

                this.logUtils.debug(
                  `found ${removedIndexNames.length} index deletions for store ${volatileTableIndex.name}`,
                );

                // Handle added indexes
                addedIndexesParams.forEach((params) => {
                  objectStore.createIndex(...params);
                });

                // Handle removed indexes
                removedIndexNames.forEach((name) => {
                  objectStore.deleteIndex(name);
                });
                if (volatileTableIndex.migrator.getCurrentVersion() == 1) {
                  // For version 1, check if the "version" index exists for old clients
                  // If it doesn't exist, we need to migrate the data
                  if (!oldIndexes.includes("version")) {
                    this.objectStoresMightNeedMigration = [
                      ...this.objectStoresMightNeedMigration,
                      volatileTableIndex.name,
                    ];
                  }
                } else {
                  this.objectStoresMightNeedMigration = [
                    ...this.objectStoresMightNeedMigration,
                    volatileTableIndex.name,
                  ];
                }
              }
            }
          });
          existingObjectStores.forEach((storeName) => {
            if (
              !this.schema.find(
                (tableDetails) => tableDetails.name === storeName,
              )
            ) {
              this.logUtils.debug(
                `Deleting removed object store: ${storeName}`,
              );
              db.deleteObjectStore(storeName);
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

    return ResultAsync.fromPromise(promise, (e) => {
      // We know that the promise rejects with a PersistenceError
      return e as PersistenceError;
    }).andThen((db) => {
      return this.persist().andThen((persisted) => {
        this.logUtils.debug("IndexDB Persist success: " + persisted);
        this._databaseConnection = db;
        return okAsync(this._databaseConnection);
      });
    });
  }

  public close(): ResultAsync<void, never> {
    if (this._databaseConnection != null) {
      //So typescript can be happy
      const dbInstance = this._databaseConnection;
      return ResultAsync.fromSafePromise(
        new Promise<void>((resolve) => {
          dbInstance.close();
          this._databaseConnection = undefined;
          resolve();
        }),
      );
    }
    return okAsync(undefined);
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

  public deleteDatabase(database: string): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise<void, PersistenceError>(
      new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(database);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new PersistenceError("Error deleting database"));
        };

        request.onblocked = () => {
          reject(new PersistenceError("Database deletion is blocked"));
        };
      }),
      (e) => e as PersistenceError,
    );
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
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyPath = this._keyPaths.get(tableName);
    // that means the object store has a primary key which is auto-incremented
    if (keyPath == undefined) {
      return okAsync(null);
    }
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
      return ResultUtils.combine(
        typeof storeNames == "string"
          ? [this.waitForStore(storeNames as ERecordKey)]
          : Array.from(storeNames).map((storeName) =>
              this.waitForStore(storeName as ERecordKey),
            ),
      ).andThen(() => {
        try {
          const tx = db.transaction(storeNames, mode);
          return okAsync(tx);
        } catch (error) {
          return errAsync(
            new PersistenceError("Object store does not exist ! "),
          );
        }
      });
    });
  }

  /**
   * Converts an array of index definitions into an array of parameters suitable for createIndex method.
   * Each index definition is represented as a tuple [name, unique] or [name[], unique].
   * The resulting array contains tuples [name, keyPath, options] ready to be passed to createIndex method.
   *
   * @param {Array<[string | Iterable<string>, boolean]>} dataIndexes - An array of index definitions.
   * @returns {Array<[string, string | Iterable<string>, IDBIndexParameters]>} - An array of parameters for createIndex method.
   * @TODO Remove this method on the next iteration.
   */
  protected _getCreateIndexParamsArray(
    dataIndexes: [string | Iterable<string>, boolean][] = [],
  ): [string, string | Iterable<string>, IDBIndexParameters][] {
    const dataIndexesParamsArray: [
      string,
      string | Iterable<string>,
      IDBIndexParameters,
    ][] = dataIndexes.map(([name, unique]) => {
      if (Array.isArray(name)) {
        const paths = name.map((x) => this._getFieldPath(x));

        return [
          this._getCompoundIndexName(paths),
          paths,
          {
            unique,
          },
        ];
      } else {
        const path = this._getFieldPath(name as VolatileStorageKey);
        return [path, path, { unique }];
      }
    });
    const metadataIndexes: [string, string, IDBIndexParameters][] =
      VolatileStorageMetadataIndexes.map(([name, unique]) => [
        name,
        name,
        { unique },
      ]);
    return [...dataIndexesParamsArray, ...metadataIndexes];
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

  private _determineIndexName(
    store: IDBObjectStore,
    index?: string,
  ): string | undefined {
    if (index === undefined) {
      return undefined;
    }

    const isMetadataIndex = VolatileStorageMetadataIndexes.some(
      ([metaIndex]) => metaIndex === index,
    );
    if (isMetadataIndex) {
      return index;
    } else if (store.indexNames.contains(this._getIndexName(index))) {
      return this._getIndexName(index);
    }

    return undefined;
  }
}
