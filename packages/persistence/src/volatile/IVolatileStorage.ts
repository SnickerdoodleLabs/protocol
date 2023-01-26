import {
  PersistenceError,
  VolatileStorageKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { VolatileStorageMetadata } from "@persistence/volatile/VolatileStorageMetadata.js";

export interface IVolatileStorage {
  persist(): ResultAsync<boolean, PersistenceError>;
  clearObjectStore(name: string): ResultAsync<void, PersistenceError>;

  putObject<T>(
    name: string,
    obj: T,
    metadata?: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError>;
  removeObject(
    name: string,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError>;

  getObject<T>(
    name: string,
    key: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  getCursor<T>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T>(
    name: string,
    index?: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
  getAllKeys<T>(
    name: string,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;
}

export const IVolatileStorageType = Symbol.for("IVolatileStorage");
