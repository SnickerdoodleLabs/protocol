import { ResultAsync } from "neverthrow";

import {
  VolatileStorageMetadata,
  VersionedObject,
} from "@objects/businessObjects";
import { PersistenceError } from "@objects/errors";

export interface IVolatileCursor<T extends VersionedObject> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
  allValues(): ResultAsync<T[] | null, PersistenceError>;

  _next(): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  _all(): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
}
