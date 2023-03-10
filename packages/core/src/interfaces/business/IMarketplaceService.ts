import {
  BlockchainProviderError,
  ConsentFactoryContractError,
  EvaluationError,
  EVMContractAddress,
  MarketplaceListing,
  PossibleReward,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceService {
  getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<
    MarketplaceListing,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getListingsTotal(): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError>;
}

export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");
