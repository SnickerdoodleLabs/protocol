import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDiscordRepository {
  fetchUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError>;

  fetchGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError>;

  upsertUserProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError>;

  getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;

  upsertGuildProfiles(
    guildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError>;

  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError>;
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");
