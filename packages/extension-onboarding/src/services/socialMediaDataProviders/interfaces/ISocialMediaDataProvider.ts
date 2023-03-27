import {  BearerAuthToken, DiscordProfile, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialMediaDataProvider {
  getUserProfiles(): ResultAsync<ISocialMediaProfileTypes[], unknown>;
  initializeUser(params : ISocialMediaDataInitParams) : ResultAsync<void,unknown>;
  installationUrl(): ResultAsync<URLString, unknown>
}

export type ISocialMediaDataInitParams = IDiscordMediaDataParams
export type ISocialMediaProfileTypes = DiscordProfile


export type IDiscordMediaDataParams = {
  discordAuthToken?: BearerAuthToken
}