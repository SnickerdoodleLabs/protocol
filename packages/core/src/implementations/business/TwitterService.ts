import {
  ESocialType,
  OAuth1RequstToken,
  OAuthVerifier,
  PersistenceError,
  TokenAndSecret,
  TwitterError,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ITwitterService } from "@core/interfaces/business/index.js";
import {
  ITwitterRepository,
  ITwitterRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class TwitterService implements ITwitterService {
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITwitterRepositoryType) public twitterRepo: ITwitterRepository,
  ) {}

  public getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, TwitterError> {
    return this.twitterRepo.getOAuth1aRequestToken();
  }

  public initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.twitterRepo.initTwitterProfile(requestToken, oAuthVerifier),
    ]).map(([context, newProfile]) => {
      context.publicEvents.onSocialProfileLinked.next(newProfile);
      return newProfile;
    });
  }

  public unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, TwitterError | PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.twitterRepo.deleteProfile(id),
    ]).map(([context]) =>
      context.publicEvents.onSocialProfileUnlinked.next([
        ESocialType.TWITTER,
        id,
      ]),
    );
  }

  public poll(): ResultAsync<void, TwitterError | PersistenceError> {
    return this.getUserProfiles()
      .andThen((profiles) => {
        return this.twitterRepo.populateProfile(profiles);
      })
      .map(() => {});
  }

  public getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError> {
    return this.twitterRepo.getUserProfiles();
  }
}
