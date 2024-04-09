import {
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  SiteVisit,
  SiteVisitsMap,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IUserSiteInteractionRepository } from "@synamint-extension-sdk/core/interfaces/data";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class UserSiteInteractionRepository
  implements IUserSiteInteractionRepository
{
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.addSiteVisits(siteVisits).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError> {
    return this.core.getSiteVisits().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getSiteVisitsMap(): ResultAsync<
    SiteVisitsMap,
    SnickerDoodleCoreError
  > {
    return this.core.getSiteVisitsMap().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
