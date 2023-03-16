import {
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { indexedDB as fakeIndexedDB } from "fake-indexeddb";
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
export class FakeDBVolatileStorage implements IVolatileStorage {
  protected indexedDB: ResultAsync<IndexedDB, never>;

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {
    this.indexedDB = this.schemaProvider
      .getVolatileStorageSchema()
      .map((schema) => new IndexedDB("SD_Wallet", schema, fakeIndexedDB));
  }

  public getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    return this.indexedDB.andThen((db) => db.getKey(tableName, obj));
  }

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    return this.indexedDB.andThen((db) => db.initialize());
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return this.indexedDB.andThen((db) => db.persist());
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return this.indexedDB.andThen((db) => db.clearObjectStore(name));
  }

  public putObject<T extends VersionedObject>(
    name: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this.indexedDB.andThen((db) => db.putObject(name, obj));
  }

  public removeObject<T extends VersionedObject>(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.indexedDB.andThen((db) => db.removeObject<T>(name, key));
  }

  public getObject<T extends VersionedObject>(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.indexedDB.andThen((db) => db.getObject<T>(name, key));
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.indexedDB.andThen((db) =>
      db.getCursor<T>(name, indexName, query, direction, mode),
    );
  }

  public getAll<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.indexedDB.andThen((db) => db.getAll<T>(name, indexName, query));
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.indexedDB.andThen((db) =>
      db.getAllKeys<T>(name, indexName, query, count),
    );
  }
}
