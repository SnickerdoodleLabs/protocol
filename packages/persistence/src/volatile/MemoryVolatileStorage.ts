import {
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";

@injectable()
export class MemoryVolatileStorage implements IVolatileStorage {
  public constructor() {}
  getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

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
    return this.getObject(name, "x")
      .andThen((hey) => {
        //@ts-ignore
        const value = [...(hey ? hey : []), obj];
        return ResultAsync.fromPromise(
          AsyncStorage.setItem(name, JSON.stringify(value)),
          (e) => e as PersistenceError,
        );
      })
      .andThen(() => okAsync(undefined));
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
        return okAsync([] as unknown as T);
      }
    });
  }

  public getCursor<T extends VersionedObject>(
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
        return okAsync([] as unknown as T[]);
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
        return okAsync([] as unknown as T[]);
      }
    });
  }
}
