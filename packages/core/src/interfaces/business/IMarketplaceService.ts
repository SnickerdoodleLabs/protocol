import {
  BlockchainProviderError,
  UninitializedError,
  ConsentFactoryContractError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
  EvaluationError,
  EVMContractAddress,
  PossibleReward,
  TBlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceService {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | TBlockchainCommonErrors
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | TBlockchainCommonErrors
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | TBlockchainCommonErrors
  >;

  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError>;
}

export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");
