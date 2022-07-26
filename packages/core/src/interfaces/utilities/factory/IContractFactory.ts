import {
  IConsentContract,
  ICrumbsContract,
  IMinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IContractFactory {
  factoryConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  >;

  factoryCrumbsContract(): ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  >;

  factoryMinimalForwarderContract(): ResultAsync<
    IMinimalForwarderContract,
    BlockchainProviderError | UninitializedError
  >;
}

export const IContractFactoryType = Symbol.for("IContractFactory");
