import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAccountIndexerPoller {
  initialize(): ResultAsync<
    void,
    PersistenceError | AccountIndexingError | AjaxError
  >;
}

export const IAccountIndexerPollerType = Symbol.for("IAccountIndexerPoller");
