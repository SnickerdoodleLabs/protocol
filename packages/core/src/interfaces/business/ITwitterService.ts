import {
  BearerAuthToken,
  ITokenAndSecret,
  PersistenceError,
  TwitterID,
  TwitterError,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITwitterService {
  getOAuth1aRequestToken(): ResultAsync<ITokenAndSecret, TwitterError>;
  initTwitterProfile(
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, TwitterError | PersistenceError>;
  poll(): ResultAsync<void, TwitterError | PersistenceError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
