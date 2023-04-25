import {
  ERecordKey,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

/**
 * This implementation just keeps everything completely in-memory in arrays and maps.
 * It's persistence only for a single run.
 * Should look at using FakeDBVolatileStorage, should be the same thing!
 */
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

  public getAllByIndex<T extends VersionedObject>(
    schemaKey: ERecordKey,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getKey(
    schemaKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    throw new Error("Method not implemented.");
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
