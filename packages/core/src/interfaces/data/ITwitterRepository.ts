import {
  BearerAuthToken,
  ITokenAndSecret,
  PersistenceError,
  TwitterID,
  TwitterConfig,
  TwitterError,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITwitterRepository {
  getOAuth1aRequestToken(
    config: TwitterConfig,
  ): ResultAsync<ITokenAndSecret, TwitterError>;
  initTwitterProfile(
    config: TwitterConfig,
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  populateProfile(
    config: TwitterConfig,
    profile: TwitterProfile,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
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
