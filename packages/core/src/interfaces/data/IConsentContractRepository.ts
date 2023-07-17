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
  DataPermissions,
  URLString,
  IpfsCID,
  Signature,
  OptInInfo,
  TokenUri,
  IConsentCapacity,
  BlockNumber,
  TBlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  /**
   * Returns all the URLs that are configured in the contract.
   * @param consentContractAddress
   */
  getInvitationUrls(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    URLString[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | TBlockchainCommonErrors
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
    | TBlockchainCommonErrors
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
    | TBlockchainCommonErrors
  >;

  getConsentToken(
    optInInfo: OptInInfo,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | TBlockchainCommonErrors
  >;

  isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | TBlockchainCommonErrors
  >;

  getLatestConsentTokenId(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    TokenId | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | TBlockchainCommonErrors
  >;

  getConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getDeployedConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | TBlockchainCommonErrors
  >;

  getSignerRoleMembers(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | TBlockchainCommonErrors
  >;

  isOpenOptInDisabled(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | TBlockchainCommonErrors
  >;

  getTokenURI(
    consentContractAddres: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | TBlockchainCommonErrors
  >;

  getQueryHorizon(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    BlockNumber,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | TBlockchainCommonErrors
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
