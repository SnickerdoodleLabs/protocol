import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentFactoryContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  ConsentFactoryContractError,
  MarketplaceListing,
  UninitializedError,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  UnixTimestamp,
  ConsentContractError,
  BlockchainCommonErrors,
  InvalidParametersError,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMarketplaceRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class MarketplaceRepository implements IMarketplaceRepository {
  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
    @inject(ITimeUtilsType)
    protected timeUtils: ITimeUtils,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
  ) {}

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.getConsentFactoryContract(),
      this.configProvider.getConfig(),
    ]).andThen(([consentFactoryContract, config]) => {
      return consentFactoryContract.getTagTotal(
        tag,
        config.controlChainInformation.governanceTokenContractAddress,
      );
    });
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.getMarketplaceTagListingsCached(tag, true).map((listings) => {
      const page = pagingReq.page;
      const pageSize = pagingReq.pageSize;
      // slice the array based on pages response
      const startingIndex = (page - 1) * pageSize;
      const endingIndex = page * pageSize - 1;
      const slicedArr = listings.slice(startingIndex, endingIndex);

      return new PagedResponse(
        slicedArr, // The result
        pagingReq.page, // which page number
        slicedArr.length, // Returned result count
        listings.length, //Total listings result
      );
    });
  }

  public getRecommendationsByListing(
    listing: MarketplaceListing,
    stakingToken: EVMContractAddress,
  ): ResultAsync<
    MarketplaceTag[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  > {
    // Check if listing has a consent contract attached
    if (listing.consentContract == null) {
      return errAsync(
        new InvalidParametersError(
          "Failed to get recommendations for requested listing. Listing does not have a consent contract.",
        ),
      );
    }

    return this.contractFactory
      .factoryConsentContracts([listing.consentContract])
      .andThen(([consentContract]) => {
        return consentContract.getTagArray(stakingToken);
      })
      .map((tagArr) => {
        // Extract its tags
        return tagArr.map((tag) =>
          tag.tag ? MarketplaceTag(tag.tag) : MarketplaceTag(""),
        );
      });
  }

  protected tagCache = new Map<MarketplaceTag, MarketplaceTagCache>();

  protected getMarketplaceTagListingsCached(
    tag: MarketplaceTag,
    toUpdate: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.configProvider.getConfig().andThen((config) => {
      const cache = this.tagCache.get(tag);

      // If listings exists and to update flag is true, it needs a new list
      if (toUpdate === true) {
        return this.buildCacheForTag(tag);
      }
      // If it exists
      if (cache != null) {
        // Check the cache time
        const now = this.timeUtils.getUnixNow();
        if (cache.cacheTime + config.marketplaceListingsCacheTime < now) {
          return this.buildCacheForTag(tag);
        }
        return okAsync(cache.listings);
      }

      // Need to rebuild the cache
      return this.buildCacheForTag(tag);
    });
  }

  protected buildCacheForTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    MarketplaceListing[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getConsentFactoryContract(),
    ])
      .andThen(([config, consentFactoryContract]) => {
        return consentFactoryContract.getListingsByTag(
          tag,
          config.controlChainInformation.governanceTokenContractAddress,
          true,
        );
      })
      .map((listings) => {
        const cache = new MarketplaceTagCache(
          tag,
          this.timeUtils.getUnixNow(),
          listings,
        );
        this.tagCache.set(tag, cache);
        return listings;
      });
  }

  protected getConsentFactoryContract(): ResultAsync<
    IConsentFactoryContract,
    BlockchainProviderError | UninitializedError
  > {
    return this.contractFactory.factoryConsentFactoryContract();
  }
}

class MarketplaceTagCache {
  public constructor(
    public tag: MarketplaceTag,
    public cacheTime: UnixTimestamp,
    public listings: MarketplaceListing[],
  ) {}
}
