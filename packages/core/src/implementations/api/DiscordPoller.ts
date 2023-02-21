import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDiscordPoller } from "@core/interfaces/api/index.js";
import {
  IDiscordService,
  IDiscordServiceType,
} from "@core/interfaces/business";

export class DiscordPoller implements IDiscordPoller {
  public constructor(
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IDiscordServiceType) protected discordService: IDiscordService,
  ) {}

  initialize(): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }
}
