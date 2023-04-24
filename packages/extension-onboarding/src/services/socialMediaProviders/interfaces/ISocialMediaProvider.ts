import { DiscordProfile, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IDiscordInitParams } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export interface ISocialMediaProvider {
  getUserProfiles(): ResultAsync<ISocialMediaProfileTypes[], unknown>;
  initializeUserWithAuthorizationCode(
    params: ISocialMediaInitParams,
  ): ResultAsync<void, unknown>;
  installationUrl(): ResultAsync<URLString, unknown>;
}

export type ISocialMediaInitParams = IDiscordInitParams;
export type ISocialMediaProfileTypes = DiscordProfile;
