import {   DiscordGuildProfile, DiscordProfile, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IDiscordMediaDataParams, ISocialMediaDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces/ISocialMediaDataProvider.js";

export interface IDiscordDataProvider extends ISocialMediaDataProvider {
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown>
  getUserProfiles(): ResultAsync<DiscordProfile[], unknown>;
  initializeUser(params : IDiscordMediaDataParams) : ResultAsync<void,unknown>;
  installationUrl(): ResultAsync<URLString, unknown>
}

