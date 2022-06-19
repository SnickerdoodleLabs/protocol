import {
  BlockchainProviderError,
  EthereumContractAddress,
  UninitializedError,
  ConsentToken,
  EthereumAccountAddress,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  initializeConsentContracts(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError
  >;

  getConsentTokens(
    consentContractAddress: EthereumContractAddress,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError>;

  isAddressOptedIn(
    consentContractAddress: EthereumContractAddress,
    address: EthereumAccountAddress,
  ): ResultAsync<boolean, ConsentContractError>;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
