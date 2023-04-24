import {
  OAuth1RequstToken,
  TokenAndSecret,
  PersistenceError,
  TwitterID,
  TwitterError,
  TwitterProfile,
  OAuthVerifier,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITwitterService {
  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, TwitterError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, TwitterError | PersistenceError>;
  poll(): ResultAsync<void, TwitterError | PersistenceError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
