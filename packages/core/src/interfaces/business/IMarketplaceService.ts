import {
  BlockchainProviderError,
  UninitializedError,
  ConsentFactoryContractError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
  Listing,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceService {
  getMarketplaceListings(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<
    PagedResponse<Listing>,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  >;

  getRecommendationsByListing(
    listing: Listing,
  ): ResultAsync<
    MarketplaceTag[],
    UninitializedError | BlockchainProviderError | ConsentContractError
  >;
}

export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");
