import { PersistenceError, VersionedObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IVolatileCursor<T extends VersionedObject> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
  allValues(): ResultAsync<T[] | null, PersistenceError>;
}
