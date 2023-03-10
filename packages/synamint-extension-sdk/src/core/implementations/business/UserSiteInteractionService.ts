import { SiteVisit, URLString } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IUserSiteInteractionService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IUserSiteInteractionRepository,
  IUserSiteInteractionRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class UserSiteInteractionService implements IUserSiteInteractionService {
  constructor(
    @inject(IUserSiteInteractionRepositoryType)
    protected userSiteInteractionRepository: IUserSiteInteractionRepository,
  ) {}

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.userSiteInteractionRepository.addSiteVisits(siteVisits);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError> {
    return this.userSiteInteractionRepository.getSiteVisits();
  }

  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    SnickerDoodleCoreError
  > {
    return this.userSiteInteractionRepository.getSiteVisitsMap();
  }
}
