import {
  BearerAuthToken,
  ITokenAndSecret,
  SnowflakeID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export type ITwitterInitParams = {
  requestToken: BearerAuthToken;
  oAuthVerifier: string;
};
export type ITwitterUnlinkProfileParams = {
  id: SnowflakeID;
};

export interface ITwitterProvider extends ISocialMediaProvider {
  getOAuth1aRequestToken(): ResultAsync<ITokenAndSecret, unknown>;
  initTwitterProfile(
    params: ITwitterInitParams,
  ): ResultAsync<TwitterProfile, unknown>;
  unlinkProfile(
    params: ITwitterUnlinkProfileParams,
  ): ResultAsync<void, unknown>;
  getUserProfiles(): ResultAsync<TwitterProfile[], unknown>;
}
