import {
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
  VolatileStorageKey,
  ERecordKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export interface IVolatileStorage {
  persist(): ResultAsync<boolean, PersistenceError>;
  clear(): ResultAsync<void, PersistenceError>;
  clearObjectStore(name: string): ResultAsync<void, PersistenceError>;

  putObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  removeObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;

  getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
  getAllByIndex<T extends VersionedObject>(
    recordKey: ERecordKey,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
  getAllKeys<T>(
    recordKey: ERecordKey,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;

  getKey<T extends VersionedObject>(
    recordKey: ERecordKey,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError>;

  get<T extends VersionedObject>(
    schemaKey: ERecordKey,
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
    schemaKey: ERecordKey,
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
}

export const IVolatileStorageType = Symbol.for("IVolatileStorage");
