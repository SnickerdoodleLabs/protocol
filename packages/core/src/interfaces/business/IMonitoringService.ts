import {
  SiteVisit,
  PersistenceError,
  AccountIndexingError,
  AjaxError,
  AccountBalanceError,
  AccountNFTError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The MonitoringService is used for monitoring the User's activity and collecting all of their data.
 * Some data is detected internally, such as via the Blockchain Listener, and some data is collected
 * externally via the form factor, such as SiteVisits.
 */
export interface IMonitoringService {
  pollTransactions(): ResultAsync<
    void,
    PersistenceError | AccountIndexingError | AjaxError
  >;
  siteVisited(siteVisit: SiteVisit): ResultAsync<void, never>;
}

export const IMonitoringServiceType = Symbol.for("IMonitoringService");
