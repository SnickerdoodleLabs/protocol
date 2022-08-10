import { PersistenceError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { resolve } from "postmate";

import { IStorageUtils } from "@utils/IStorageUtils";

export interface StoreInfo {
  name: string;
  keyPath?: string;
  indexBy?: [string, boolean][];
}

export class IndexeDBUtils {
  private _db?: IDBDatabase;
  private _initialized = false;

  public constructor(public name: string, private schema: StoreInfo[]) {}

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    if (this._initialized) {
      return okAsync(this._db!);
    }

    if (!window.indexedDB) {
      return errAsync(new PersistenceError("indexed db not supported"));
    }

    const schema = this.schema;
    const request = window.indexedDB.open(this.name);
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
          const keyPathObj: IDBObjectStoreParameters =
            storeInfo.keyPath == undefined
              ? { autoIncrement: true }
              : { keyPath: storeInfo.keyPath };
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
      return okAsync(this._db);
    });
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
        const request = store.add(obj);
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
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    direction?: IDBCursorDirection | undefined,
  ): ResultAsync<IDBCursorWithValue, PersistenceError> {
    return this.initialize().andThen((db) => {
      return this.getObjectStore(name, "readonly").andThen((store) => {
        const request = store.openCursor(query, direction);
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
        ).andThen((cursor) => okAsync(cursor as IDBCursorWithValue));
      });
    });
  }
}
