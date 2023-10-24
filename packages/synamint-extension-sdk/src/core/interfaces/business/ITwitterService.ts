import {
  OAuth1RequstToken,
  TokenAndSecret,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface ITwitterService {
  getOAuth1aRequestToken(
    sourceDomain?: DomainName,
  ): ResultAsync<TokenAndSecret, SnickerDoodleCoreError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
    sourceDomain?: DomainName,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError>;
  unlinkProfile(
    id: TwitterID,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getUserProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<TwitterProfile[], SnickerDoodleCoreError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
