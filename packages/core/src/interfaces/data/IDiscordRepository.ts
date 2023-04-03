import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
  URLString,
  SocialPrimaryKey,
  SnowflakeID,
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
  getProfileById(
    id: SnowflakeID,
  ): ResultAsync<DiscordProfile | null, PersistenceError>;

  upsertGuildProfiles(
    guildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError>;

  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError>;
  deleteProfile(id: SnowflakeID): ResultAsync<void, PersistenceError>;
  deleteGroupProfile(id: SnowflakeID): ResultAsync<void, PersistenceError>;
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");
