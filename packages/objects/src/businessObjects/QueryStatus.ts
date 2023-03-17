import { EQueryProcessingStatus } from "@objects/enum/index.js";
import {
  BlockNumber,
  IpfsCID,
  UnixTimestamp,
} from "@objects/primitives/index.js";

/**
 * This object stores the state of processing for a recieved SDQL Query. Once we hear about a query
 * from the blockchain, we should create a QueryStatus object for that query that we can use to
 * track the progress. The query is recieved but not immediately processed for insights. It is
 * immediately processed for EligibleAds. Once all EligibleAds have been viewed (via core.getAd()),
 * OR the user has indicated they don't want to see any more ads for the query (via core.completeShowingAds()),
 * the query should be processed and insights generated. The Insights and any Ad Signatures collected
 * are returned to the IP.
 * @param queryCID
 * @param status Current status of the query
 * @param expirationDate Technically retrievable from IPFS, we'll cache it here. We need to process the query before this date, so periodically we need to look for queries that are about to expire.
 */
export class QueryStatus {
  public constructor(
    public queryCID: IpfsCID,
    public receivedBlock: BlockNumber,
    public status: EQueryProcessingStatus,
    public expirationDate: UnixTimestamp,
  ) {}
}
