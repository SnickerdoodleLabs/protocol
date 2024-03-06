import {
  DomainName,
  MarketplaceListing,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  EVMContractAddress,
  IpfsCID,
  EarnedReward,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IMarketplaceService {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError>;

  getListingsTotalByTag(
    tag: MarketplaceTag,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<number, SnickerDoodleCoreError>;

  getRecommendationsByListing(
    listing: MarketplaceListing,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<MarketplaceTag[], SnickerDoodleCoreError>;

  getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  >;
}
export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");

