import { injectable, inject } from "inversify";
import {
  DomainName,
  MarketplaceListing,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  EVMContractAddress,
  IpfsCID,
  EarnedReward,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { IMarketplaceService } from "../../interfaces/business/IMarketplaceService";
import { ResultAsync } from "neverthrow";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class MarketplaceService implements IMarketplaceService {
  constructor(
    @inject(ISnickerdoodleCoreType) private core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) private errorUtils: IErrorUtils,
  ) {}

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive: boolean = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError> {
    return this.core.marketplace
      .getMarketplaceListingsByTag(pagingReq, tag, filterActive)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core.marketplace.getListingsTotalByTag(tag).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }

  public getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<MarketplaceTag[], SnickerDoodleCoreError> {
    return this.core.marketplace
      .getRecommendationsByListing(listing)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  > {
    return this.core.marketplace
      .getEarnedRewardsByContractAddress(contractAddresses, timeoutMs)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }
}
