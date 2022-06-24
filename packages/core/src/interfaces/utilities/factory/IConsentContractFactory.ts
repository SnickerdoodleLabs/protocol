import { ResultAsync } from "neverthrow";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EthereumContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";

export interface IConsentContractFactory {
  factoryConsentContracts(
    consentContractAddresses: EthereumContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  >;
}

export const IConsentContractFactoryType = Symbol.for(
  "IConsentContractFactory",
);
