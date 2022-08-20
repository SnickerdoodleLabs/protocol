import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface VolatileTableIndex {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexBy?: [string, boolean][];
}

export interface VolatileTableConfig {
  name: string;
  schema: VolatileTableIndex[];
}

export interface IVolatileStorageTable {
  persist(): ResultAsync<boolean, PersistenceError>;
  clearObjectStore(name: string): ResultAsync<void, PersistenceError>;
  putObject<T>(name: string, obj: T): ResultAsync<void, PersistenceError>;
  removeObject(name: string, key: string): ResultAsync<void, PersistenceError>;
  getObject<T>(
    name: string,
    key: string,
  ): ResultAsync<T | null, PersistenceError>;
  getCursor<T>(
    name: string,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T>(
    name: string,
    indexName?: string,
  ): ResultAsync<T[], PersistenceError>;
  getAllKeys<T>(
    name: string,
    indexName?: string,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError>;
}

export interface IVolatileCursor<T> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
}
