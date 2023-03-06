import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { SiteVisit, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IUserSiteInteractionService {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError>;

  getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    SnickerDoodleCoreError
  >;
}

export const IUserSiteInteractionServiceType = Symbol.for(
  "IUserSiteInteractionService",
);
