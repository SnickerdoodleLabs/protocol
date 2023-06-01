import {
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageQuery,
  ERecordKey,
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
  protected indexedDB: ResultAsync<IndexedDB, never> | null = null;

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {
    this.indexedDB = this.schemaProvider
      .getVolatileStorageSchema()
      .map(
        (schema) =>
          new IndexedDB(
            "SD_Wallet",
            Array.from(schema.values()),
            fakeIndexedDB,
          ),
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

  public clearObjectStore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.clearObjectStore(recordKey));
  }

  public putObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.putObject(recordKey, obj));
  }

  public removeObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    return this._getIDB().andThen((db) => db.removeObject(recordKey, key));
  }

  public getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this._getIDB().andThen((db) => db.getObject(recordKey, key));
  }

  public getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this._getIDB().andThen((db) => db.getCursor(recordKey, query));
  }

  public getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    return this._getIDB().andThen((db) => db.getAll(recordKey, query));
  }

  public getAllKeys<T>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    return this._getIDB().andThen((db) => db.getAllKeys(recordKey, query));
  }
}
