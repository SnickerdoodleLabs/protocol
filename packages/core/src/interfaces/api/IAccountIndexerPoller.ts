import { ResultAsync } from "neverthrow";

export interface IAccountIndexerPoller {
  initialize(): ResultAsync<void, never>;
}

export const IAccountIndexerPollerType = Symbol.for("IAccountIndexerPoller");
