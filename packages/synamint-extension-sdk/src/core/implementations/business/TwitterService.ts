import {
  OAuth1RequstToken,
  TokenAndSecret,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ITwitterService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  ITwitterRepository,
  ITwitterRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class TwitterService implements ITwitterService {
  constructor(
    @inject(ITwitterRepositoryType)
    protected twitterRepository: ITwitterRepository,
  ) {}

  public getOAuth1aRequestToken(): ResultAsync<
    TokenAndSecret,
    SnickerDoodleCoreError
  > {
    return this.twitterRepository.getOAuth1aRequestToken();
  }

  public initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError> {
    return this.twitterRepository.initTwitterProfile(
      requestToken,
      oAuthVerifier,
    );
  }

  public unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.twitterRepository.unlinkProfile(id);
  }

  public getUserProfiles(
  ): ResultAsync<TwitterProfile[], SnickerDoodleCoreError> {
    return this.twitterRepository.getUserProfiles();
  }
}
