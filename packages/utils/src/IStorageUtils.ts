import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStorageUtils {
  getMaxDocumentSize(): ResultAsync<number, never>;
  remove(key: string | string[]): ResultAsync<void, PersistenceError>;
  write<T>(key: string, value: T): ResultAsync<void, PersistenceError>;
  read<T>(key: string): ResultAsync<T | null, PersistenceError>;
  clear(): ResultAsync<void, PersistenceError>;
}

export const IStorageUtilsType = Symbol.for("IStorageUtils");
