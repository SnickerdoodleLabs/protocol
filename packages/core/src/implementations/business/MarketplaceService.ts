/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  UninitializedError,
  BlockchainProviderError,
  ConsentFactoryContractError,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IMarketplaceService } from "@core/interfaces/business/index.js";
import {
  IMarketplaceRepositoryType,
  IMarketplaceRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class MarketplaceService implements IMarketplaceService {
  public constructor(
    @inject(IMarketplaceRepositoryType)
    protected marketplaceRepo: IMarketplaceRepository,
  ) {}

  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<
    MarketplaceListing,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getMarketplaceListings(count, headAt);
  }

  public getListingsTotal(): ResultAsync<
    number,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getListingsTotal();
  }
}
