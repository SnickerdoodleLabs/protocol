import {
  MarketplaceListing,
  ConsentFactoryContractError,
  BlockchainProviderError,
  UninitializedError,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  ConsentContractError,
  TBlockchainCommonErrors,
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
    | TBlockchainCommonErrors
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | TBlockchainCommonErrors
    | TBlockchainCommonErrors
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | TBlockchainCommonErrors
  >;
}

export const IMarketplaceRepositoryType = Symbol.for("IMarketplaceRepository");
