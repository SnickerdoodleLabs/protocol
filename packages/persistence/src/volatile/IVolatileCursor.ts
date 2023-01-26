import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { VolatileStorageMetadata } from "./VolatileStorageMetadata";

export interface IVolatileCursor<T> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
  allValues(): ResultAsync<T[] | null, PersistenceError>;

  _next(): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  _all(): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
}
