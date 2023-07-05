import {
  ClickData,
  ISDQLTimestampRange,
  PersistenceError,
  SiteVisit,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBrowsingDataRepository {
  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  addClick(click: ClickData): ResultAsync<void, PersistenceError>;

  /** This returns you click data that you have stored, according to the filter */
  getClicks(): ResultAsync<ClickData[], PersistenceError>;

  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;

  // return a map of URLs
  getSiteVisitsMap(timestampRange ?:ISDQLTimestampRange): ResultAsync<Map<URLString, number>, PersistenceError>;
}

export const IBrowsingDataRepositoryType = Symbol.for(
  "IBrowsingDataRepository",
);
