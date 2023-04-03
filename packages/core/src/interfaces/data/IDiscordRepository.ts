import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
  URLString,
  DiscordAccessToken,
  AjaxError,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDiscordRepository {
  isAuthTokenValid(
    accessToken: DiscordAccessToken,
  ): ResultAsync<boolean, DiscordError>;

  getAccessToken(
    code: OAuthAuthorizationCode,
  ): ResultAsync<DiscordAccessToken, DiscordError>;

  refreshAuthToken(
    refreshToken: BearerAuthToken,
  ): ResultAsync<DiscordAccessToken, DiscordError>;

  fetchUserProfile(
    accessToken: DiscordAccessToken,
  ): ResultAsync<DiscordProfile, DiscordError>;

  fetchGuildProfiles(
    accessToken: DiscordAccessToken,
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
