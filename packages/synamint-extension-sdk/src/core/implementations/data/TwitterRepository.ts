import {
  BearerAuthToken,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  ITokenAndSecret,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ITwitterRepository } from "@synamint-extension-sdk/core/interfaces/data/index.js";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities/index.js";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class TwitterRepository implements ITwitterRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public getOAuth1aRequestToken(): ResultAsync<
    ITokenAndSecret,
    SnickerDoodleCoreError
  > {
    return this.core.twitter.getOAuth1aRequestToken().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public initTwitterProfile(
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, SnickerDoodleCoreError> {
    return this.core.twitter
      .initTwitterProfile(requestToken, oAuthVerifier)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.twitter.unlinkProfile(id).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getUserProfiles(): ResultAsync<
    TwitterProfile[],
    SnickerDoodleCoreError
  > {
    return this.core.twitter.getUserProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
