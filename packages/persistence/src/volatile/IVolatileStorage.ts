import {
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
  VolatileStorageKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export interface IVolatileStorage {
  persist(): ResultAsync<boolean, PersistenceError>;
  clearObjectStore(name: string): ResultAsync<void, PersistenceError>;

  putObject<T extends VersionedObject>(
    name: string,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  removeObject<T extends VersionedObject>(
    name: string,
    key: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;

  getObject<T extends VersionedObject>(
    name: string,
    key: VolatileStorageKey,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  getCursor<T extends VersionedObject>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T extends VersionedObject>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
  getAllKeys<T>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;

  getKey(
    tableName: string,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError>;
}

export const IVolatileStorageType = Symbol.for("IVolatileStorage");
