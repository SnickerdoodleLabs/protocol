import {
  MarketplaceListing,
  ConsentFactoryContractError,
  BlockchainProviderError,
  UninitializedError,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceRepository {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;
}

export const IMarketplaceRepositoryType = Symbol.for("IMarketplaceRepository");
