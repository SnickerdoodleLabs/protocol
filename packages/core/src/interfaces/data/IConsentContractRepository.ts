import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
  ConsentToken,
  EVMAccountAddress,
  ConsentContractError,
  AjaxError,
  ConsentContractRepositoryError,
  ConsentFactoryContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  getConsentTokens(
    consentContractAddress: EVMContractAddress,
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    ConsentToken[],
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  getCurrentConsentToken(
    consentContractAddress: EVMContractAddress,
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
    address?: EVMAccountAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  getConsentContracts(): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getOptedInConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
