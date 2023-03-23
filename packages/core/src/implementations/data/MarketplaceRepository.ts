import { IMarketplaceRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  IConsentContract,
  IConsentFactoryContract,
  Listing,
  ListingSlot,
  Tag,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  ConsentFactoryContractError,
  MarketplaceListing,
  UninitializedError,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  UnixTimestamp,
  EVMContractAddress,
  ConsentName,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class MarketplaceRepository implements IMarketplaceRepository {
  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
    @inject(ITimeUtilsType)
    protected timeUtils: ITimeUtils,
  ) {}

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getConsentFactoryContract().andThen(
      (consentFactoryContract) => {
        return consentFactoryContract.getNumberOfListings(tag);
      },
    );
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<Listing>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getMarketplaceTagListingsCached(tag, filterActive).map(
      (listings) => {
        const page = pagingReq.page;
        const pageSize = pagingReq.pageSize;
        // slice the array based on pages response
        const startingIndex = (page - 1) * pageSize - 1;
        const endingIndex = page * pageSize - 1;
        const slicedArr = listings.slice(startingIndex, endingIndex);

        // if sliced array does not contain any items, return error as the there is insufficient data
        if (slicedArr.length == 0) {
        }

        return new PagedResponse(
          slicedArr, // The result
          pagingReq.page, // which page number
          slicedArr.length, // Returned result count
          listings.length, //Total listings result
        );
      },
    );
  }

  public getRecommendationsByListing(
    listing: Listing,
  ): ResultAsync<
    MarketplaceTag[],
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getConsentContract([
      listing.consentContract
        ? listing.consentContract
        : EVMContractAddress("0"),
    ]).andThen((consentContracts) => {
      return ResultUtils.combine(
        consentContracts.map((consentContract) => {
          return consentContract.getTagArray();
        }),
      ).map((tagArrs) => {
        // Return array is an array or array of Tag
        // Flatten and extract its tags
        return tagArrs
          .flat()
          .map((tag) =>
            tag.tag ? MarketplaceTag(tag.tag) : MarketplaceTag(""),
          );
      });
    });
  }

  protected tagCache = new Map<MarketplaceTag, MarketplaceTagCache>();
  protected listingsCacheTime = 5; //make this from config provider // how lpng should i tag market place queries
  protected getMarketplaceTagListingsCached(
    tag: MarketplaceTag,
    filterActive: boolean,
  ): ResultAsync<
    Listing[],
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    const cache = this.tagCache.get(tag);

    // If it exists
    if (cache != null) {
      // Check the cache time
      const now = this.timeUtils.getUnixNow();
      if (cache.cacheTime + this.listingsCacheTime < now) {
        return this.buildCacheForTag(tag, filterActive);
      }
      return okAsync(cache.listings);
    }

    // Need to rebuild the cache
    return this.buildCacheForTag(tag, filterActive);
  }

  protected buildCacheForTag(
    tag: MarketplaceTag,
    filterActive: boolean,
  ): ResultAsync<
    Listing[],
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getConsentFactoryContract()
      .andThen((consentFactoryContract) => {
        return consentFactoryContract
          .getNumberOfListings(tag)
          .andThen((totalListings) => {
            // Get all listings, starting from slot 1
            return consentFactoryContract.getListingsForward(
              tag,
              ListingSlot(BigInt(ethers.constants.MaxUint256.toString())),
              totalListings,
              filterActive,
            );
          });
      })
      .map((listings) => {
        // Remove the first item from the array as it is the MaxUint256's slot that only helps point to the rank 1
        // This will help avoid misrepresentations in total listings count downstream
        listings.shift();
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

  protected getConsentContract(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  > {
    return this.contractFactory.factoryConsentContracts(contractAddresses);
  }
}

class MarketplaceTagCache {
  public constructor(
    public tag: MarketplaceTag,
    public cacheTime: UnixTimestamp,
    public listings: Listing[],
  ) {}
}
