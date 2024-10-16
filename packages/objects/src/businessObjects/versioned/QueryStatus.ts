import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  EQueryProcessingStatus,
  EWalletDataType,
} from "@objects/enum/index.js";
import { IQueryPermissions } from "@objects/interfaces/index.js";
import {
  BlockNumber,
  EVMContractAddress,
  IpfsCID,
  JSONString,
  URLString,
  UnixTimestamp,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

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
export class QueryStatus extends VersionedObject {
  public static CURRENT_VERSION = 3;
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public receivedBlock: BlockNumber,
    public status: EQueryProcessingStatus,
    public expirationDate: UnixTimestamp,
    public rewardsParameters: JSONString,
    public name: string,
    public description: string,
    public points: number,
    public questionnaires: IpfsCID[],
    public virtualQuestionnaires: EWalletDataType[],
    public image: IpfsCID | null,
    public queryPermissions: IQueryPermissions,
  ) {
    super();
  }

  public getVersion(): number {
    return QueryStatus.CURRENT_VERSION;
  }
}

export class QueryStatusMigrator extends VersionedObjectMigrator<QueryStatus> {
  public getCurrentVersion(): number {
    return QueryStatus.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<QueryStatus>): QueryStatus {
    return new QueryStatus(
      data.consentContractAddress,
      data.queryCID,
      data.receivedBlock,
      data.status,
      data.expirationDate,
      data.rewardsParameters,
      data.name,
      data.description,
      data.points,
      data.questionnaires,
      data.virtualQuestionnaires,
      data.image,
      data.queryPermissions,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map([
      [
        1,
        (data: Partial<QueryStatus>) => {
          data.name = data.name ?? "Offer";
          data.description = data.description ?? "";
          data.points = data.points ?? 0;
          data.questionnaires = data.questionnaires ?? [];
          data.virtualQuestionnaires = data.virtualQuestionnaires ?? [];
          data.rewardsParameters = data.rewardsParameters ?? JSONString("{}");
          data.image = data.image ?? null;
          return data;
        },
      ],
      [
        2,
        (data: Partial<QueryStatus>) => {
          data.queryPermissions = {
            questionnaires: data.questionnaires ?? [],
            virtualQuestionnaires: data.virtualQuestionnaires ?? [],
          };
          return data;
        },
      ],
    ]);
  }
}
