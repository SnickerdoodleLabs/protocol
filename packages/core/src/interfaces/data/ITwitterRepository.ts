import {
  OAuth1RequstToken,
  OAuthVerifier,
  PersistenceError,
  TokenAndSecret,
  TwitterError,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITwitterRepository {
  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, TwitterError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  populateProfile(
    profiles: TwitterProfile[],
  ): ResultAsync<TwitterProfile[], TwitterError | PersistenceError>;
  upsertUserProfile(
    twitterProfile: TwitterProfile,
  ): ResultAsync<void, PersistenceError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError>;
  deleteProfile(id: TwitterID): ResultAsync<void, PersistenceError>;
  getProfileById(
    id: TwitterID,
  ): ResultAsync<TwitterProfile | null, PersistenceError>;
}

export const ITwitterRepositoryType = Symbol.for("ITwitterRepository");
