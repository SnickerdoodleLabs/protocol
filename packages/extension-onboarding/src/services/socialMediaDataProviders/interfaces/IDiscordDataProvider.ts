import {   DiscordGuildProfile, DiscordProfile, SnowflakeID, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IDiscordMediaDataParams, ISocialMediaDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces/ISocialMediaDataProvider.js";

export interface IDiscordDataProvider extends ISocialMediaDataProvider {
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown>
  getUserProfiles(): ResultAsync<DiscordProfile[], unknown>;
  initializeUser(params : IDiscordMediaDataParams) : ResultAsync<void,unknown>;
  unlinkAccount(discordProfileId : SnowflakeID) : ResultAsync<void,unknown>;
  installationUrl(): ResultAsync<URLString, unknown>
  getOauthTokenFromDiscord(code: string) : Promise<Response>
}


export interface IDiscordAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}