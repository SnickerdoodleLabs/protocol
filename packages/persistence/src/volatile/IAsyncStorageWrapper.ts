import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAsyncStorageWrapper {
  getItem(key: string): ResultAsync<string | null, PersistenceError>;

  setItem(key: string, value: string): ResultAsync<void, PersistenceError>;

  removeItem(key: string): ResultAsync<void, PersistenceError>;

  getAllKeys(): ResultAsync<readonly string[], PersistenceError>;

  // Returns a map of key, value
  getItems(
    keys: string[],
  ): ResultAsync<Map<string, string | null>, PersistenceError>;
}

export const IAsyncStorageWrapperType = Symbol.for("IAsyncStorageWrapper");
