import {
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  MarketplaceListing,
  MarketplaceTag,
  BlockchainCommonErrors,
  TransactionResponseError,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { EConsentRoles } from "@contracts-sdk/interfaces/enums/index.js";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  WrappedTransactionResponse,
  ContractOverrides,
} from "@contracts-sdk/interfaces/objects/index.js";

export interface IConsentFactoryContract extends IBaseContract {
  /**
   * Creates a consent contract for user
   * @param ownerAddress Address of the owner of the Consent contract instance
   * @param baseUri Base uri for the for the Consent contract instance
   * @param name Name for the for the Consent contract instance
   * @param overrides Any transaction call overrides
   */
  createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  /**
   *  Return the amount of gas required to create a Consent contract
   * @param ownerAddress Address of the user
   * @param baseUri URI for consent contract
   * @param name Name of the consent contract
   */
  estimateGasToCreateConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
  ): ResultAsync<bigint, ConsentFactoryContractError | BlockchainCommonErrors>;

  /**
   *  Return the number Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors>;

  /**
   *  Return the an array of Consent addresses that user has deployed between two indexes
   * @param ownerAddress Address of the user
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   *  Return the an array of Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   *  Return the number Consent addresses that user has specific roles for
   * @param ownerAddress Address of the user
   * @param role The queried role
   */
  getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: EConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors>;

  /**
   *  Return the an array of Consent addresses that user has specific roles for
   * @param ownerAddress Address of the user
   * @param role The queried role
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: EConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   *  Return Consent addresses by checking ContractDeployed event logs
   */
  getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Marketplace Listings
   */
  getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  setListingDuration(
    listingDuration: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  setMaxTagsPerListing(
    maxTagsPerListing: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  adminRemoveListing(
    tag: MarketplaceTag,
    removedSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  getListingDetail(
    tag: MarketplaceTag,
    slot: BigNumberString,
  ): ResultAsync<
    MarketplaceListing,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getListingsForward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getListingsBackward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getTagTotal(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors>;

  /**
   *  Return the list of marketplace listings of a specific tag
   * @param tag marketplace tag string
   */
  getListingsByTag(
    tag: MarketplaceTag,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError>;

  // #region Questionnaires
  getQuestionnaires(): ResultAsync<
    IpfsCID[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;
  // #endregion Questionnaires
}
