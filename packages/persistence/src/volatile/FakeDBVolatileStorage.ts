import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DatabaseVersion,
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
  //@TODO update here
  protected indexedDB: ResultAsync<IndexedDB, never> | null = null;

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  private _getIDB(): ResultAsync<IndexedDB, never> {
    if (this.indexedDB != null) {
      return this.indexedDB;
    }

    this.indexedDB = this.schemaProvider
      .getVolatileStorageSchema()
      .map(
        (schema) =>
          new IndexedDB(
            "SD_Wallet",
            Array.from(schema.values()),
            fakeIndexedDB,
            this.logUtils,
            this.timeUtils,
            DatabaseVersion,
          ),
      );
    return this.indexedDB;
  }

  public get<T extends VersionedObject>(
    schemaKey: string,
    {
      index,
      query = null,
      count,
      id,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      count?: number;
      id?: IDBValidKey;
    } = {},
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.get<T>(schemaKey, {
        index,
        query,
        count,
        id,
      }),
    );
  }

  public countRecords(
    schemaKey: string,
    {
      index,
      query = undefined,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | undefined;
    } = {},
  ): ResultAsync<number, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.countRecords(schemaKey, {
        index,
        query,
      }),
    );
  }

  public getKeys(
    schemaKey: string,
    {
      index,
      query = null,
      count,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      count?: number;
    } = {},
  ): ResultAsync<IDBValidKey[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getKeys(schemaKey, {
        index,
        query,
        count,
      }),
    );
  }

  public getCursor2<T extends VersionedObject>(
    schemaKey: string,
    {
      index,
      query = null,
      lowerCount,
      upperCount,
      latest = false,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      lowerCount?: number;
      upperCount?: number;
      latest?: boolean;
    } = {},
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) =>
    {
      return db.getCursor2<T>(schemaKey, {
        index,
        query,
        lowerCount,
        upperCount,
        latest,
      });
    });
  }

  public getKey<T extends VersionedObject>(
    tableName: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    return this._getIDB().andThen((db) => db.getKey(tableName, obj));
  }

  public initialize(): ResultAsync<IDBDatabase, PersistenceError> {
    return this._getIDB().andThen((db) => db.initialize());
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return this._getIDB().andThen((db) => db.persist());
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.clear());
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.clearObjectStore(name));
  }

  public putObject<T extends VersionedObject>(
    name: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.putObject(name, obj));
  }

  public removeObject<T extends VersionedObject>(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this._getIDB().andThen((db) => db.removeObject<T>(name, key));
  }

  public getObject<T extends VersionedObject>(
    name: string,
    key: string,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getObject<T>(name, key, _includeDeleted),
    );
  }

  public getCursor<T extends VersionedObject>(
    name: string,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getCursor<T>(name, indexName, query, direction, mode),
    );
  }

  public getAll<T extends VersionedObject>(
    name: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) => db.getAll<T>(name));
  }

  public getAllByIndex<T extends VersionedObject>(
    name: string,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getAllByIndex<T>(name, index, query),
    );
    // return this.indexedDB.getAllByIndex<T>(name, index, query);
  }

  public getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: string | number,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getAllKeys<T>(name, indexName, query, count),
    );
  }
}
