import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { SiteVisit } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IUserSiteInteractionService {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IUserSiteInteractionServiceType = Symbol.for(
  "IUserSiteInteractionService",
);
