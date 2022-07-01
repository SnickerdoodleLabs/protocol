import { SiteVisit, EVMTransaction } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The MonitoringService is used for monitoring the User's activity and collecting all of their data.
 * Some data is detected internally, such as via the Blockchain Listener, and some data is collected
 * externally via the form factor, such as SiteVisits.
 */
export interface IMonitoringService {
  transactionDetected(transaction: EVMTransaction): ResultAsync<void, never>;
  siteVisited(siteVisit: SiteVisit): ResultAsync<void, never>;
}

export const IMonitoringServiceType = Symbol.for("IMonitoringService");
