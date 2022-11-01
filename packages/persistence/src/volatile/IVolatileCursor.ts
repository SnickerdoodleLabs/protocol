import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IVolatileCursor<T> {
  nextValue(): ResultAsync<T | null, PersistenceError>;
  allValues(): ResultAsync<T[] | null, PersistenceError>;
}
