import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export type IDiscordInitParams = {
  discordAuthToken?: BearerAuthToken;
};

export interface IDiscordProvider extends ISocialMediaProvider {
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown>;
  getUserProfiles(): ResultAsync<DiscordProfile[], unknown>;
  initializeUser(params: IDiscordInitParams): ResultAsync<void, unknown>;
  unlink(discordProfileId: SnowflakeID): ResultAsync<void, unknown>;
  installationUrl(): ResultAsync<URLString, unknown>;
  getOauthTokenFromDiscord(code: string): Promise<Response>;
}

export interface IDiscordAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
