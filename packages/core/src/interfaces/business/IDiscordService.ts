import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  OAuthError,
  PersistenceError,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IOAuthService } from "@core/interfaces/utilities/IOAuthService";

export interface IDiscordService extends IOAuthService {
  initializeUser(
    authToken: BearerAuthToken,
  ): ResultAsync<void, DiscordError | PersistenceError>;
  getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError>;
  // getUserProfile(
  //   authToken: BearerAuthToken,
  // ): ResultAsync<DiscordProfile, DiscordError>;

  // getGuildProfiles(
  //   authToken: BearerAuthToken,
  // ): ResultAsync<DiscordGuildProfile[], DiscordError>;
  getAuthTokens(): ResultAsync<BearerAuthToken[], PersistenceError>;
  poll(): ResultAsync<void, DiscordError | PersistenceError>;
  unlinkAccount( discordProfileId : SnowflakeID): ResultAsync<void, DiscordError | PersistenceError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
