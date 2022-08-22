import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { SiteVisit } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IUserSiteInteractionRepository {
  addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IUserSiteInteractionRepositoryType = Symbol.for(
  "IUserSiteInteractionRepository",
);
