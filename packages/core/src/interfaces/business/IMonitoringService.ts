import {
  SiteVisit,
  PersistenceError,
  AccountIndexingError,
  AjaxError,
  DataWalletBackupID,
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
  pollBackups(): ResultAsync<void, PersistenceError>;
  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  siteVisited(siteVisit: SiteVisit): ResultAsync<void, PersistenceError>;
}

export const IMonitoringServiceType = Symbol.for("IMonitoringService");
