import {
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  DiscordRefreshToken,
  OAuth2Tokens,
  OAuthAuthorizationCode,
  PersistenceError,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDiscordRepository {
  isAuthTokenValid(
    oAuth2Tokens: OAuth2Tokens,
  ): ResultAsync<boolean, DiscordError>;

  getAccessToken(
    code: OAuthAuthorizationCode,
  ): ResultAsync<OAuth2Tokens, DiscordError>;

  refreshAuthToken(
    refreshToken: DiscordRefreshToken,
  ): ResultAsync<OAuth2Tokens, DiscordError>;

  fetchUserProfile(
    oauth2Tokens: OAuth2Tokens,
  ): ResultAsync<DiscordProfile, DiscordError>;

  fetchGuildProfiles(
    oauth2Tokens: OAuth2Tokens,
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
  // deleteGroupProfile(id: SnowflakeID): ResultAsync<void, PersistenceError>;
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");
