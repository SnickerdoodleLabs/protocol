import { ResultAsync } from "neverthrow";

export interface IDiscordPoller {
  initialize(): ResultAsync<void, never>;
}

export const IDiscordPollerType = Symbol.for("IDiscordPoller");
