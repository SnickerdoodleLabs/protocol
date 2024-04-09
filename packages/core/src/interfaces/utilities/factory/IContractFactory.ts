import {
  IConsentContract,
  IConsentFactoryContract,
  IQuestionnairesContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IContractFactory {
  factoryConsentFactoryContract(): ResultAsync<
    IConsentFactoryContract,
    BlockchainProviderError | UninitializedError
  >;

  factoryConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  >;

  factoryQuestionnairesContract(): ResultAsync<
    IQuestionnairesContract,
    BlockchainProviderError | UninitializedError
  >;
}

export const IContractFactoryType = Symbol.for("IContractFactory");
