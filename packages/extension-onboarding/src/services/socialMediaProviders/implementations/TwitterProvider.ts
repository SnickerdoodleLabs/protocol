/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TokenAndSecret, TwitterProfile } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  ITwitterInitParams,
  ITwitterProvider,
  ITwitterUnlinkProfileParams,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";

declare const window: IWindowWithSdlDataWallet;

export class TwitterProvider implements ITwitterProvider {
  constructor() {}

  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, unknown> {
    return window.sdlDataWallet.twitter
      .getOAuth1aRequestToken()
      .mapErr(() => new Error("Could not get twitter user profiles!"));
  }
  initTwitterProfile(
    params: ITwitterInitParams,
  ): ResultAsync<TwitterProfile, unknown> {
    const { requestToken, oAuthVerifier } = params;
    return window.sdlDataWallet.twitter
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
    return window.sdlDataWallet.twitter.unlinkProfile(id).mapErr(() => {
      return new Error(`Could not unlink Twitter profile with id ${id}`);
    });
  }
  getUserProfiles(): ResultAsync<TwitterProfile[], unknown> {
    return window.sdlDataWallet.twitter.getUserProfiles().mapErr(() => {
      return new Error(`Could not get linked Twitter accounts.`);
    });
  }
}
