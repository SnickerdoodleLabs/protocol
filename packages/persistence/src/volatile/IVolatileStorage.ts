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

  getKey(
    recordKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey, PersistenceError>;
}

export const IVolatileStorageType = Symbol.for("IVolatileStorage");
