import { IUserSiteInteractionService } from "@interfaces/business";
import {
  IUserSiteInteractionRepository,
  IUserSiteInteractionRepositoryType,
} from "@interfaces/data";

import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { SiteVisit } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

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
}
