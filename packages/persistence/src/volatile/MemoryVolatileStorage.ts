import { PersistenceError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IndexedDB } from "@persistence/volatile/IndexedDB.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { volatileStorageSchema } from "@persistence/volatile/VolatileStorageSchema.js";
import { IndexedDBCursor } from "./IndexedDBCursor";

@injectable()
export class MemoryVolatileStorage implements IVolatileStorage {
  public constructor() {}

  public persist(): ResultAsync<boolean, PersistenceError> {
    console.log("persist");
    return okAsync(true);
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    console.log("clearObjectStore");
    return okAsync(undefined);
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    console.log("putObject");
    AsyncStorage.setItem(name, JSON.stringify(obj));
    return okAsync(undefined);
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<void, PersistenceError> {
    console.log("removeObject");
    AsyncStorage.removeItem(name);
    return okAsync(undefined);
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    const promise = AsyncStorage.getItem(name);
    console.log("getObjectPromise", promise);
    return ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error getting object", e),
    ).andThen((result) => {
      if (result) {
        return okAsync(JSON.parse(result) as T);
      } else {
        return okAsync(undefined as unknown as T);
      }
    });
  }

  public getCursor<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    console.log("getCursor");
    //@ts-ignore
    return okAsync(null);
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    const promise = AsyncStorage.getItem(name);
    console.log("getAll", { name, indexName });
    return ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error getting object", e),
      //@ts-ignore
    ).andThen((result) => {
      if (result) {
        return okAsync(JSON.parse(result) as T[]);
      } else {
        return okAsync(undefined as unknown as T[]);
      }
    });
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    console.log("getAllKeys", { name, indexName, query, count });
    const promise = AsyncStorage.getItem(name);
    return ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error getting object", e),
      //@ts-ignore
    ).andThen((result) => {
      if (result) {
        return okAsync(JSON.parse(result) as T[]) ?? {};
      } else {
        return okAsync(undefined as unknown as T[]);
      }
    });
  }
}
