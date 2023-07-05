import {
  PersistenceError,
  VersionedObject,
  VolatileStorageDataKey,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

@injectable()
export class MemoryVolatileStorage implements IVolatileStorage {
  private _keyPaths: Map<string, string | string[]>;
  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
  ) {
    this._keyPaths = new Map();
    this.schema.forEach((x) => {
      this._keyPaths.set(x.name, x.keyPath);
    });
  }
  getAllByIndex<T extends VersionedObject>(
    name: string,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyPath = this._keyPaths.get(tableName);
    if (keyPath == undefined) {
      return errAsync(new PersistenceError("invalid table name"));
    }

    if (keyPath == VolatileTableIndex.DEFAULT_KEY) {
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
        new PersistenceError("error extracting key from object", e),
      );
    }
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return okAsync(true);
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    return this.getObject(name, "x")
      .andThen((hey) => {
        //@ts-ignore

        if (hey.includes(obj)) {
          return ResultAsync.fromPromise(
            AsyncStorage.setItem(name, JSON.stringify(hey)),
            (e) => e as PersistenceError,
          );
        } else {
          //@ts-ignore
          const value = [...(hey ? hey : []), obj];
          return ResultAsync.fromPromise(
            AsyncStorage.setItem(name, JSON.stringify(value)),
            (e) => e as PersistenceError,
          );
        }
      })
      .andThen(() => okAsync(undefined));
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<any> | null, PersistenceError> {
    AsyncStorage.removeItem(name);
    return okAsync(null);
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    AsyncStorage.getAllKeys().then((keys) => {});
    const promise = AsyncStorage.getItem(name);

    return ResultAsync.fromPromise(
      promise,
      (e) => new PersistenceError("error getting object"),
    )
      .andThen((result) => {
        if (result) {
          return okAsync(JSON.parse(result) as T);
        } else {
          return okAsync([] as unknown as T);
        }
      })
      .orElse((e) => {
        return okAsync([] as unknown as T);
      });
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    //@ts-ignore
    return okAsync(null);
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    const promise = AsyncStorage.getItem(name);
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

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
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
