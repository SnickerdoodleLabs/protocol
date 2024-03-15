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
  TokenUri,
  IConsentCapacity,
  BlockNumber,
  BlockchainCommonErrors,
  Commitment,
  BigNumberString,
  InvalidParametersError,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractRepository {
  /**
   * Returns true if the requested domain name is approved in the contract
   * @param consentContractAddress
   */
  checkDomain(
    consentContractAddress: EVMContractAddress,
    domain: DomainName,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getQuestionnaires(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID[],
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

  getCommitmentIndex(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    number,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  >;

  isNonceUsed(
    consentContractAddress: EVMContractAddress,
    nonce: TokenId,
  ): ResultAsync<
    boolean,
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

  // #region Consent Contract Factory
  getDeployedConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getDefaultQuestionnaires(): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;
  // #endregion Consent Contract Factory

  getSignerRoleMembers(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  isOpenOptInDisabled(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
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

  getCommitmentCount(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getAnonymitySet(
    consentContractAddress: EVMContractAddress,
    start: number,
    count: number,
  ): ResultAsync<
    Commitment[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  >;
}

export const IConsentContractRepositoryType = Symbol.for(
  "IConsentContractRepository",
);
