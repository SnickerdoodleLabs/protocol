import {
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IVolatileCursor<T extends VersionedObject> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
  allValues(): ResultAsync<T[] | null, PersistenceError>;

  _next(): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError>;
  _all(): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;
}
