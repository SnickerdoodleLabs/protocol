import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DatabaseVersion,
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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  private _getIDB(): ResultAsync<IndexedDB, never> {
    if (this.indexedDB != null) {
      return this.indexedDB;
    }

    this.indexedDB = this.schemaProvider
      .getVolatileStorageSchema()
      .map((schema) => {
        return new IndexedDB(
          "SD_Wallet",
          Array.from(schema.values()),
          indexedDB, // This is magical; it's a global variable IDBFactory
          this.logUtils,
          this.timeUtils,
          DatabaseVersion,
        );
      });
    return this.indexedDB;
  }

  public getKey(
    recordKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey, PersistenceError> {
    return this._getIDB().andThen((db) => {
      return db.getKey(recordKey, obj);
    });
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

  public clear(): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => {
      return db.clear();
    });
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

  //@TODO update here, though no use case actually exist for now
  public getCursor<T extends VersionedObject>(
    schemaKey: ERecordKey,
    indexName?: string,
    _query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this._getIDB().andThen((db) =>
      db.getCursor<T>(
        schemaKey,
        indexName,
        undefined,
        undefined,
        undefined,
        undefined,
        direction,
        mode,
      ),
    );
  }

  public getAll<T extends VersionedObject>(
    schemaKey: ERecordKey,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._getIDB().andThen((db) => db.getAll<T>(schemaKey));
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
}
