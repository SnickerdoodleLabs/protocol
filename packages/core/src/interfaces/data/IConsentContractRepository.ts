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
  HexString,
  TokenId,
  ConsentConditions,
  URLString,
  IpfsCID,
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

  /**
   * Returns all the URLs that are configured in the contract.
   * @param consentContractAddress
   */
  getInvitationUrls(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    URLString[],
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;

  /**
   * Returns the IPFS CID of the metadata for the contract
   * @param consentContractAddress
   */
  getMetadataCID(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    BlockchainProviderError | UninitializedError | ConsentContractError
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

  // Encoders
  encodeOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
  encodeOptOut(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
