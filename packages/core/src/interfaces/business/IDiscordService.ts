import {
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
  DiscordID,
  OAuthAuthorizationCode,
  OAuth2Tokens,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IOAuthService } from "@core/interfaces/utilities/IOAuthService";

export interface IDiscordService extends IOAuthService {
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, DiscordError | PersistenceError>;
  getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError>;
  poll(): ResultAsync<void, DiscordError | PersistenceError>;
  unlink(
    userProfileId: DiscordID,
  ): ResultAsync<void, DiscordError | PersistenceError>;
  getOAuth2Tokens(): ResultAsync<OAuth2Tokens[], PersistenceError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
