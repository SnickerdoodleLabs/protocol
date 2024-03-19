import { ResultAsync } from "neverthrow";

import {
  VersionedObject,
  VolatileStorageMetadata,
} from "@objects/businessObjects";
import { PersistenceError } from "@objects/errors";
import { IVolatileCursor } from "@objects/interfaces";
import { VolatileStorageKey } from "@objects/primitives";

export interface IIndexedDB {
  initialize(): ResultAsync<IDBDatabase, PersistenceError>;
  close(): ResultAsync<void, PersistenceError>;
  persist(): ResultAsync<boolean, PersistenceError>;
  clear(): ResultAsync<void, PersistenceError>;
  clearObjectStore(name: string): ResultAsync<void, PersistenceError>;
  putObject<T>(name: string, obj: T): ResultAsync<void, PersistenceError>;
  removeObject<T extends VersionedObject>(
    name: string,
    key: string,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;

  getObject<T extends VersionedObject>(
    name: string,
    key: VolatileStorageKey,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;

  getCursor<T extends VersionedObject>(
    name: string,
    index?: VolatileStorageKey,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;

  deleteDatabase(database: string): ResultAsync<void, PersistenceError>;

  getAll<T extends VersionedObject>(
    storeName: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  getAllByIndex<T extends VersionedObject>(
    name: string,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  getAllKeys<T>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;

  get<T extends VersionedObject>(
    name: string,
    {
      index,
      query,
      count,
      id,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      count?: number;
      id?: IDBValidKey;
    },
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  getKeys(
    name: string,
    {
      index,
      query,
      count,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      count?: number;
    },
  ): ResultAsync<IDBValidKey[], PersistenceError>;

  getCursor2<T extends VersionedObject>(
    name: string,
    {
      index,
      query,
      lowerCount,
      upperCount,
      latest,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | null;
      lowerCount?: number;
      upperCount?: number;
      latest?: boolean;
    },
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  countRecords(
    name: string,
    {
      index,
      query,
    }: {
      index?: string;
      query?: IDBValidKey | IDBKeyRange | undefined;
    },
  ): ResultAsync<number, PersistenceError>;

  getKey<T extends VersionedObject>(
    tableName: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError>;
}

export const IIndexedDBType = Symbol.for("IIndexedDB");
