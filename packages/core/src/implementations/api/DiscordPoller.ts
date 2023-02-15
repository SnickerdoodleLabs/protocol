import { ResultAsync } from "neverthrow";

import { IDiscordPoller } from "@core/interfaces/api/index.js";

export class DiscordPoller implements IDiscordPoller {
  initialize(): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }
}
