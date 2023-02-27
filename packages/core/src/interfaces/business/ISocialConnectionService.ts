import {
  DiscordProfile,
  PersistenceError,
  DiscordGuildProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialConnectionService {
  upsertDiscordProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError>;

  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;

  upsertDiscordGuildProfiles(
    discordGuildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError>;

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  >;
}

export const ISocialConnectionServiceType = Symbol.for(
  "ISocialConnectionService",
);
