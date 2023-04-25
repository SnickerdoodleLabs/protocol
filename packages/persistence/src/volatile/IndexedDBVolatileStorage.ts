import {
  ERecordKey,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IndexedDB } from "@persistence/volatile/IndexedDB.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";

@injectable()
export class IndexedDBVolatileStorage implements IVolatileStorage {
  protected indexedDB: ResultAsync<IndexedDB, never> | null = null;

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {}

  public getKey(
    schemaKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    return this._getIDB().andThen((db) => db.getKey(schemaKey, obj));
  }

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    return this._getIDB().andThen((db) => db.initialize());
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return this._getIDB().andThen((db) => db.persist());
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.clearObjectStore(name));
  }

  public putObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.putObject(schemaKey, obj));
  }

  public removeObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this._getIDB().andThen((db) => db.removeObject<T>(schemaKey, key));
  }

  public getObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    key: string,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getObject<T>(schemaKey, key, _includeDeleted),
    );
  }

  public getCursor<T extends VersionedObject>(
    schemaKey: ERecordKey,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getCursor<T>(schemaKey, indexName, query, direction, mode),
    );
  }

  public getAll<T extends VersionedObject>(
    schemaKey: ERecordKey,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getAll<T>(schemaKey, indexName, query),
    );
  }

  public getAllByIndex<T extends VersionedObject>(
    schemaKey: ERecordKey,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getAllByIndex<T>(schemaKey, index, query),
    );
  }

  public getAllKeys<T>(
    schemaKey: ERecordKey,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getAllKeys<T>(schemaKey, indexName, query, count),
    );
  }

  private _getIDB(): ResultAsync<IndexedDB, never> {
    if (this.indexedDB != null) {
      return this.indexedDB;
    }

    this.indexedDB = this.schemaProvider
      .getVolatileStorageSchema()
      .map(
        (schema) =>
          new IndexedDB("SD_Wallet", Array.from(schema.values()), indexedDB),
      );
    return this.indexedDB;
  }
}
