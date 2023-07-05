import {
  OAuth1RequstToken,
  TokenAndSecret,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export type ITwitterInitParams = {
  requestToken: OAuth1RequstToken;
  oAuthVerifier: OAuthVerifier;
};
export type ITwitterUnlinkProfileParams = {
  id: TwitterID;
};

export interface ITwitterProvider extends ISocialMediaProvider {
  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, unknown>;
  initTwitterProfile(
    params: ITwitterInitParams,
  ): ResultAsync<TwitterProfile, unknown>;
  unlinkProfile(
    params: ITwitterUnlinkProfileParams,
  ): ResultAsync<void, unknown>;
  getUserProfiles(): ResultAsync<TwitterProfile[], unknown>;
  getTwitterApiAuthUrl(tokenAndSecret : TokenAndSecret) : URLString
}
