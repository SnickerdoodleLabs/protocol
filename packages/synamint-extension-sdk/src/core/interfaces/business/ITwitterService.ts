import {
  OAuth1RequstToken,
  TokenAndSecret,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface ITwitterService {
  getOAuth1aRequestToken(): ResultAsync<
    TokenAndSecret,
    SnickerDoodleCoreError
  >;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError>;
  unlinkProfile(id: TwitterID): ResultAsync<void, SnickerDoodleCoreError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], SnickerDoodleCoreError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
