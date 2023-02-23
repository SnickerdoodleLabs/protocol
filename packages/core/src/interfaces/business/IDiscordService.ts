import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  OAuthError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IOAuthService } from "@core/interfaces/utilities/IOAuthService";

export interface IDiscordService extends IOAuthService {
  initializeUser(authToken: BearerAuthToken): ResultAsync<void, DiscordError>;
  getUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError>;

  getGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
