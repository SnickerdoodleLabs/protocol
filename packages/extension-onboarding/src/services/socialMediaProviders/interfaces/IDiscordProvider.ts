import {
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  DiscordID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export type IDiscordInitParams = {
  code?: OAuthAuthorizationCode;
};

export interface IDiscordProvider extends ISocialMediaProvider {
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown>;
  getUserProfiles(): ResultAsync<DiscordProfile[], unknown>;
  initializeUserWithAuthorizationCode(
    params: IDiscordInitParams,
  ): ResultAsync<void, unknown>;
  unlink(discordProfileId: DiscordID): ResultAsync<void, unknown>;
  installationUrl(): ResultAsync<URLString, unknown>;
}

export interface IDiscordAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
