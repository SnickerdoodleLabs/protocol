// @ts-nocheck

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ERecordKey,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

/**
 * This implementation just keeps everything completely in-memory in arrays and maps.
 * It's persistence only for a single run.
 * Should look at using FakeDBVolatileStorage, should be the same thing!
 */
// @ts-nocheck
@injectable()
export class MemoryVolatileStorage implements IVolatileStorage {
  private _keyPaths: Map<ERecordKey, string | string[]>;
  public constructor(
    public name: string,
    private schema: VolatileTableIndex<VersionedObject>[],
  ) {
    this._keyPaths = new Map();
    this.schema.forEach((x) => {
      this._keyPaths.set(x.name, x.keyPath);
    });
  }

  public getAllByIndex<T extends VersionedObject>(
    schemaKey: ERecordKey,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getKey(
    recordKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey, PersistenceError> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyPath = this._keyPaths.get(recordKey);
    if (keyPath == undefined) {
      return errAsync(new PersistenceError("invalid table name"));
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
    throw new Error("Method not implemented.");
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public putObject<T>(
    schemaKey: ERecordKey,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public removeObject(
    schemaKey: ERecordKey,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<any> | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getObject<T>(
    schemaKey: ERecordKey,
    key: string,
  ): ResultAsync<T | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getCursor<T extends VersionedObject>(
    schemaKey: ERecordKey,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAll<T>(
    schemaKey: ERecordKey,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
