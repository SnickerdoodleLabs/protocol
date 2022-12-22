import { IMarketplaceRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import { IConsentFactoryContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  ConsentFactoryContractError,
  MarketplaceListing,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class MarketplaceRepository implements IMarketplaceRepository {
  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
  ) {}

  public getListingsTotal(): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getConsentFactoryContract().andThen(
      (consentFactoryContract) => {
        return consentFactoryContract.listingsTotal();
      },
    );
  }

  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<
    MarketplaceListing,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getConsentFactoryContract().andThen(
      (consentFactoryContract) => {
        return consentFactoryContract.getMarketplaceListings(count, headAt);
      },
    );
  }

  protected getConsentFactoryContract(): ResultAsync<
    IConsentFactoryContract,
    BlockchainProviderError | UninitializedError
  > {
    return this.contractFactory.factoryConsentFactoryContract();
  }
}
