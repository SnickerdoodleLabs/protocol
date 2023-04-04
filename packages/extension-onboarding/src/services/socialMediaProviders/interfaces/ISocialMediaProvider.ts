import {
  BearerAuthToken,
  DiscordProfile,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialMediaProvider {
  getUserProfiles(): ResultAsync<ISocialMediaProfileTypes[], unknown>;
  initializeUser(params: ISocialMediaInitParams): ResultAsync<void, unknown>;
  installationUrl(): ResultAsync<URLString, unknown>;
}

export type ISocialMediaInitParams = IDiscordInitParams;
export type ISocialMediaProfileTypes = DiscordProfile;

export type IDiscordInitParams = {
  discordAuthToken?: BearerAuthToken;
};
