import { SiteVisit, SiteVisitsMap, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IUserSiteInteractionService {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError>;

  getSiteVisitsMap(): ResultAsync<
    SiteVisitsMap,
    SnickerDoodleCoreError
  >;
}

export const IUserSiteInteractionServiceType = Symbol.for(
  "IUserSiteInteractionService",
);
