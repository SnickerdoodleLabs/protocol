import {
  SiteVisit,
  SiteVisitInsight,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IUserSiteInteractionRepository {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError>;

  getSiteVisitInsights(): ResultAsync<
    SiteVisitInsight[],
    SnickerDoodleCoreError
  >;
}

export const IUserSiteInteractionRepositoryType = Symbol.for(
  "IUserSiteInteractionRepository",
);
