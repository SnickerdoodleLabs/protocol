/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IMarketplaceService } from "@core/interfaces/business/index.js";
import {
  IMarketplaceRepositoryType,
  IMarketplaceRepository,
} from "@core/interfaces/data/index.js";
import {
  UninitializedError,
  BlockchainProviderError,
  ConsentFactoryContractError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class MarketplaceService implements IMarketplaceService {
  public constructor(
    @inject(IMarketplaceRepositoryType)
    protected marketplaceRepo: IMarketplaceRepository,
  ) {}

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getMarketplaceListingsByTag(
      pagingReq,
      tag,
      filterActive,
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getListingsTotalByTag(tag);
  }

  public getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    UninitializedError | BlockchainProviderError | ConsentContractError
  > {
    return this.marketplaceRepo.getRecommendationsByListing(listing);
  }
}
