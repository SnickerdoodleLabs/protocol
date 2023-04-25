import {
  ERecordKey,
  JSONString,
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
import { MMKV } from "react-native-mmkv";

@injectable()
export class MemoryVolatileStorage implements IVolatileStorage {
  private _keyPaths: Map<string, string | string[]>;
  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
    private MMKVStorage: MMKV,
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
    console.log("getAllByIndex", { name, index, query });
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
    console.log("clearObjectStore", name);
    this.MMKVStorage.delete(name);
    return okAsync(undefined);
  }

  public putObject<T>(
    name: string,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    if (obj == null) {
      console.warn("null object placed in volatile store");
      return okAsync(undefined);
    }
    const keyPath = this.getKeyWithTableName(name);
    if (Array.isArray(keyPath)) {
      const storageKey = [];
      keyPath.map((keyItem) => {
        //@ts-ignore
        storageKey.push(obj.data[keyItem]);
      });

      obj["key"] = storageKey;
      console.log("PUTOBJECT", { name, obj });
      const allObjects = this.MMKVStorage.getString(name);
      if (allObjects) {
        const parsedAllObjects: Array<any> = JSON.parse(allObjects);
        console.log("PUTOBJECT_ELSE_PARSEDALLOBJECTS", parsedAllObjects);
        if (parsedAllObjects.includes(obj)) {
          return okAsync(undefined);
        } else {
          const newObject = [...parsedAllObjects, obj];
          console.log("PUTOBJECT_ELSE_NEWOBJECT", newObject);
          this.MMKVStorage.set(name, JSON.stringify(newObject));
          return okAsync(undefined);
        }
      } else {
        this.MMKVStorage.set(name, JSON.stringify(obj));
        return okAsync(undefined);
      }
    } else {
      //@ts-ignore
      obj["key"] = obj.data[keyPath];
      console.log("PUTOBJECT_ELSE", { name, obj });
      const allObjects = this.MMKVStorage.getString(name);
      if (allObjects) {
        const parsedAllObjects: Array<any> = JSON.parse(allObjects);
        console.log("PUTOBJECT_ELSE_PARSEDALLOBJECTS", parsedAllObjects);
        if (parsedAllObjects.includes(obj)) {
          return okAsync(undefined);
        } else {
          const newObject = [...parsedAllObjects, obj];
          console.log("PUTOBJECT_ELSE_NEWOBJECT", newObject);
          this.MMKVStorage.set(name, JSON.stringify(newObject));
          return okAsync(undefined);
        }
      } else {
        this.MMKVStorage.set(name, JSON.stringify(obj));
        return okAsync(undefined);
      }
    }
  }

  public removeObject(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<any> | null, PersistenceError> {
    console.log("removeObject", { name, key });
    const getTable = this.MMKVStorage.getString(name);
    if (getTable) {
      const arrayObj = JSON.parse(getTable);
      const filteredArray = arrayObj.filter((obj) => obj.key === key);
      const UnfilteredArray = arrayObj.filter((obj) => obj.key !== key);
      if (UnfilteredArray) {
        this.MMKVStorage.set(name, JSON.stringify(filteredArray));
      }
      if (filteredArray) {
        return filteredArray[0];
      } else {
        return okAsync(null);
      }
    } else {
      return okAsync(null);
    }
  }

  public getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    console.log("GETOBJECT", { name, key });
    const get = this.MMKVStorage.getString(name);
    if (get) {
      const allObjects = JSON.parse(get);
      console.log("GETOBJECT_ALLOBJECTS", JSON.parse(get));
      const filteredArray = allObjects.filter((obj) => obj.key === key);
      if (filteredArray.length > 0) {
        console.log("GETOBJECT_FILTEREDARRAY", filteredArray);
        return okAsync(filteredArray[0]);
      } else {
        console.log("GETOBJECT_FILTEREDARRAY<0");
        return okAsync([] as unknown as T);
      }
    } else {
      console.log(`GETOBJECT ${name} not found on persistence`);
      return okAsync([] as unknown as T);
    }
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    console.log("getCursor", {
      name,
      indexName,
      query,
      direction,
      mode,
    });
    //@ts-ignore
    return okAsync(null);
  }

  public getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    console.log("GETALL", { name, indexName });
    const all = this.MMKVStorage.getString(name);
    if (all) {
      const arrayObj = JSON.parse(all);
      console.log("GETALL_ARRAYOBJ", arrayObj);
      return okAsync(arrayObj);
    } else {
      console.log(`GETALL ${name} not found in persistence)`);

      return okAsync([] as unknown as T[]);
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

  public getKeyWithTableName(tableName: string) {
    switch (tableName) {
      case ERecordKey.ACCOUNT:
        return "sourceAccountAddress";
      case ERecordKey.TRANSACTIONS:
        return "hash";
      case ERecordKey.LATEST_BLOCK:
        return "contract";
      case ERecordKey.EARNED_REWARDS:
        return ["queryCID", "name", "contractAddress", "chainId"];
      case ERecordKey.ELIGIBLE_ADS:
        return ["queryCID", "key"];
      case ERecordKey.AD_SIGNATURES:
        return ["queryCID", "adKey"];
      case ERecordKey.COIN_INFO:
        return ["chain", "address"];
      case ERecordKey.RECEIVING_ADDRESSES:
        return "contractAddress";
      case ERecordKey.QUERY_STATUS:
        return "queryCID";
      case ERecordKey.DOMAIN_CREDENTIALS:
        return "domain";
      case ERecordKey.SOCIAL_PROFILE:
        return "pKey";
      case ERecordKey.SOCIAL_GROUP:
        return "pKey";

      default:
        return "id";
    }
  }
}
