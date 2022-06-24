import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EthereumContractAddress,
  UninitializedError,
  ConsentToken,
  EthereumAccountAddress,
  ConsentContractError,
  AjaxError,
  ConsentContractRepositoryError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  initializeConsentContracts(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | AjaxError
  >;

  getConsentTokens(
    consentContractAddress: EthereumContractAddress,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    ConsentToken[],
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  isAddressOptedIn(
    consentContractAddress: EthereumContractAddress,
    address?: EthereumAccountAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  getConsentContracts(): ResultAsync<
    Map<EthereumContractAddress, IConsentContract>,
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
