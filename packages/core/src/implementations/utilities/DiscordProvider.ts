import {
  BearerAuthToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { DiscordService } from "../business/DiscordService";

import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

export class DiscordProvider {
  public constructor(
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
  ) {}
}
