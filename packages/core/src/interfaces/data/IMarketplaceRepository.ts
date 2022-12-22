import {
  MarketplaceListing,
  ConsentFactoryContractError,
  BlockchainProviderError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceRepository {
  getMarketplaceListings(
    count?: number,
    headAt?: number,
  ): ResultAsync<
    MarketplaceListing,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;
  getListingsTotal(): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;
}

export const IMarketplaceRepositoryType = Symbol.for("IMarketplaceRepository");
