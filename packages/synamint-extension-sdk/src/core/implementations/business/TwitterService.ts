import {
  DomainName,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  OAuth1RequstToken,
  OAuthVerifier,
  TokenAndSecret,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ITwitterService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class TwitterService implements ITwitterService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public getOAuth1aRequestToken(
    sourceDomain?: DomainName,
  ): ResultAsync<TokenAndSecret, SnickerDoodleCoreError> {
    return this.core.twitter
      .getOAuth1aRequestToken(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
    sourceDomain?: DomainName,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError> {
    return this.core.twitter
      .initTwitterProfile(requestToken, oAuthVerifier, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public unlinkProfile(
    id: TwitterID,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.twitter.unlinkProfile(id, sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getUserProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<TwitterProfile[], SnickerDoodleCoreError> {
    return this.core.twitter.getUserProfiles(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
