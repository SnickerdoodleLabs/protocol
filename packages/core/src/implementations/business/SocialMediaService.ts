import {
  DiscordProfile,
  PersistenceError,
  DiscordGuildProfile,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDiscordService,
  IDiscordServiceType,
  ISocialMediaService,
} from "@core/interfaces/business/index.js";

@injectable()
export class SocialMediaService implements ISocialMediaService {
  constructor(
    @inject(IDiscordServiceType)
    protected discordService: IDiscordService,
  ) {}

  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.discordService.getUserProfiles();
  }

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    return this.discordService.getGuildProfiles();
  }
}
