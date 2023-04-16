import {
  BearerAuthToken,
  ITokenAndSecret,
  SnowflakeID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface ITwitterService {
  getOAuth1aRequestToken(): ResultAsync<
    ITokenAndSecret,
    SnickerDoodleCoreError
  >;
  initTwitterProfile(
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError>;
  unlinkProfile(id: SnowflakeID): ResultAsync<void, SnickerDoodleCoreError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], SnickerDoodleCoreError>;
}

export const ITwitterServiceType = Symbol.for("ITwitterService");
