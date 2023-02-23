import { SiteVisit, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IUserSiteInteractionRepository {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError>;

  getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    SnickerDoodleCoreError
  >;
}

export const IUserSiteInteractionRepositoryType = Symbol.for(
  "IUserSiteInteractionRepository",
);
