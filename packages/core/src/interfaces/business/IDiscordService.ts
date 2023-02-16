import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  OAuthError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDiscordService {
  isAuthTokenValid(authToken: BearerAuthToken): ResultAsync<void, OAuthError>;
  refreshAuthToken(
    refreshToken: BearerAuthToken,
  ): ResultAsync<void, OAuthError>;
  getUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError>;

  getGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
