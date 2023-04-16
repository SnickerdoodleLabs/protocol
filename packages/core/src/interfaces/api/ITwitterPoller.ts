import { ResultAsync } from "neverthrow";

export interface ITwitterPoller {
  initialize(): ResultAsync<void, never>;
}

export const ITwitterPollerType = Symbol.for("ITwitterPoller");
