import {
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
  SnowflakeID,
  OAuthAuthorizationCode,
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
    userProfileId: SnowflakeID,
  ): ResultAsync<void, DiscordError | PersistenceError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
