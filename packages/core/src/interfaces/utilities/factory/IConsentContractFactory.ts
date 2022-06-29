import { ResultAsync } from "neverthrow";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";

export interface IConsentContractFactory {
  factoryConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  >;
}

export const IConsentContractFactoryType = Symbol.for(
  "IConsentContractFactory",
);
