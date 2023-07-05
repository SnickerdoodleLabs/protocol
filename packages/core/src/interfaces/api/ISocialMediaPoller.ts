import { ResultAsync } from "neverthrow";

export interface ISocialMediaPoller {
  initialize(): ResultAsync<void, never>;
}

export const ISocialMediaPollerType = Symbol.for("ISocialMediaPoller");
