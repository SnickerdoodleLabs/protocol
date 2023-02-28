import {
  DiscordProfile,
  PersistenceError,
  DiscordGuildProfile,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { ISocialConnectionService } from "@core/interfaces/business/index.js";
import {
  IDiscordRepository,
  IDiscordRepositoryType,
} from "@core/interfaces/data/index.js";
@injectable()
export class SocialConnectionService implements ISocialConnectionService {
  constructor(
    @inject(IDiscordRepositoryType)
    protected discordRepo: IDiscordRepository,
  ) {}

  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }
}
