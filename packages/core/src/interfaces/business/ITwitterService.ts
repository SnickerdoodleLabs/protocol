import {
  BearerAuthToken,
  ITokenAndSecret,
  PersistenceError,
  SnowflakeID,
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
    id: SnowflakeID,
  ): ResultAsync<void, TwitterError | PersistenceError>;
  poll(): ResultAsync<void, TwitterError | PersistenceError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
