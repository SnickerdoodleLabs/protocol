import {
  BearerAuthToken,
  ITokenAndSecret,
  PersistenceError,
  SnowflakeID,
  TwitterConfig,
  TwitterError,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ITwitterService } from "@core/interfaces/business/index.js";
import {
  ITwitterRepository,
  ITwitterRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class TwitterService implements ITwitterService {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITwitterRepositoryType) public twitterRepo: ITwitterRepository,
  ) {}

  public getOAuth1aRequestToken(): ResultAsync<ITokenAndSecret, TwitterError> {
    return this._getTwitterConfig().andThen((config) => {
      console.log(
        "TwitterService getOAuth1aRequestToken config.oAuthCallbackUrl: " +
          config.oAuthCallbackUrl,
      );
      return this.twitterRepo.getOAuth1aRequestToken(config);
    });
  }

  public initTwitterProfile(
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    return this._getTwitterConfig().andThen((config) => {
      return ResultUtils.combine([
        this.contextProvider.getContext(),
        this.twitterRepo.initTwitterProfile(
          config,
          requestToken,
          oAuthVerifier,
        ),
      ]).map(([context, newProfile]) => {
        context.publicEvents.onTwitterProfileLinked.next(
          newProfile.userObject.id,
        );
        return newProfile;
      });
    });
  }

  public unlinkProfile(
    id: SnowflakeID,
  ): ResultAsync<void, TwitterError | PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.twitterRepo.deleteProfile(id),
    ]).map(([context]) =>
      context.publicEvents.onTwitterProfileUnlinked.next(id),
    );
  }

  public poll(): ResultAsync<void, TwitterError | PersistenceError> {
    return this._getTwitterConfig().andThen((config) => {
      return this.twitterRepo
        .getUserProfiles()
        .andThen((profiles) => {
          return ResultUtils.combine(
            profiles.map((profile) =>
              this.twitterRepo.populateProfile(config, profile),
            ),
          );
        })
        .map(() => {});
    });
  }

  public getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError> {
    return this.twitterRepo.getUserProfiles();
  }

  private _getTwitterConfig(): ResultAsync<TwitterConfig, TwitterError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (config.twitter == null) {
        return errAsync(new TwitterError("Twitter configuration is NULL!"));
      }
      return okAsync(config.twitter);
    });
  }
}
