import {
  AccountIndexingError,
  AjaxError,
  DataWalletBackupID,
  DiscordError,
  InvalidParametersError,
  MethodSupportError,
  PersistenceError,
  SiteVisit,
  TwitterError,
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
  pollNfts(): ResultAsync<void, unknown>;
  pollBackups(): ResultAsync<void, PersistenceError>;
  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  siteVisited(siteVisit: SiteVisit): ResultAsync<void, PersistenceError>;
  pollDiscord(): ResultAsync<void, PersistenceError | DiscordError>;
  pollTwitter(): ResultAsync<void, PersistenceError | TwitterError>;
}

export const IMonitoringServiceType = Symbol.for("IMonitoringService");
