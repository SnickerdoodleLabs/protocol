import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
  ConsentToken,
  EVMAccountAddress,
  ConsentContractError,
  AjaxError,
  ConsentFactoryContractError,
  HexString,
  TokenId,
  DataPermissions,
  IpfsCID,
  Signature,
  TokenUri,
  IConsentCapacity,
  BlockNumber,
  BlockchainCommonErrors,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  /**
   * Returns all the domains that are configured in the contract.
   * @param consentContractAddress
   */
  getDomains(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    DomainName[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  /**
   * Returns the number of "slots" available to opt-in to the contract as availableOptInCount and maxCapacity as maxCapacity, which is just
   * maxCapacity - currentOptins.
   * @param consentContractAddress
   */
  getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentCapacity,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  /**
   * Returns the IPFS CID of the metadata for the contract
   * @param consentContractAddress
   */
  getMetadataCID(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getConsentToken(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  >;

  isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | BlockchainCommonErrors
  >;

  getLatestConsentTokenId(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    TokenId | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  >;

  getConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getConsentContract(
    consentContractAddresses: EVMContractAddress,
  ): ResultAsync<
    IConsentContract,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getDeployedConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getSignerRoleMembers(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  isOpenOptInDisabled(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getTokenURI(
    consentContractAddres: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  >;

  getQueryHorizon(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    BlockNumber,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  // Encoders
  encodeOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
  encodeRestrictedOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    signature: Signature,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
  encodeAnonymousRestrictedOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    signature: Signature,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
  encodeOptOut(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
  encodeUpdateAgreementFlags(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
