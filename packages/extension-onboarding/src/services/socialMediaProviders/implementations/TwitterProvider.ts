/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ISdlDataWallet,
  TokenAndSecret,
  TwitterProfile,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ITwitterInitParams,
  ITwitterProvider,
  ITwitterUnlinkProfileParams,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";


export class TwitterProvider implements ITwitterProvider {
  constructor(private sdlDataWallet: ISdlDataWallet) {}

  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, unknown> {
    return this.sdlDataWallet.twitter
      .getOAuth1aRequestToken()
      .mapErr(() => new Error("Could not get twitter user profiles!"));
  }
  initTwitterProfile(
    params: ITwitterInitParams,
  ): ResultAsync<TwitterProfile, unknown> {
    const { requestToken, oAuthVerifier } = params;
    return this.sdlDataWallet.twitter
      .initTwitterProfile(requestToken, oAuthVerifier)
      .mapErr(() => {
        return new Error(
          `Could not init Twitter profile with request token ${requestToken} and verifier ${oAuthVerifier}`,
        );
      });
  }
  unlinkProfile(
    params: ITwitterUnlinkProfileParams,
  ): ResultAsync<void, unknown> {
    const { id } = params;
    return this.sdlDataWallet.twitter.unlinkProfile(id).mapErr(() => {
      return new Error(`Could not unlink Twitter profile with id ${id}`);
    });
  }
  getUserProfiles(): ResultAsync<TwitterProfile[], unknown> {
    return this.sdlDataWallet.twitter.getUserProfiles().mapErr(() => {
      return new Error(`Could not get linked Twitter accounts.`);
    });
  }

  getTwitterApiAuthUrl(tokenAndSecret: TokenAndSecret): URLString {
    return URLString(
      `https://api.twitter.com/oauth/authorize?oauth_token=${tokenAndSecret.token}&oauth_token_secret=${tokenAndSecret.secret}&oauth_callback_confirmed=true`,
    );
  }
}
