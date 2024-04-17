import {
  MarketplaceListing,
  ConsentFactoryContractError,
  BlockchainProviderError,
  UninitializedError,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  ConsentContractError,
  BlockchainCommonErrors,
  InvalidParametersError,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceRepository {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | BlockchainCommonErrors
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
    stakingToken: EVMContractAddress,
  ): ResultAsync<
    MarketplaceTag[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  >;
}

export const IMarketplaceRepositoryType = Symbol.for("IMarketplaceRepository");
