import { DiscordProfile, TwitterProfile } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  IDiscordInitParams,
  ITwitterInitParams,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";

export interface ISocialMediaProvider {
  getUserProfiles(): ResultAsync<ISocialMediaProfileTypes[], unknown>;
}

export type ISocialMediaInitParams = IDiscordInitParams | ITwitterInitParams;
export type ISocialMediaProfileTypes = DiscordProfile | TwitterProfile;
