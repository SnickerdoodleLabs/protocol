import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  WrappedTransactionResponse,
  ConsentRoles,
  ContractOverrides,
} from "@contracts-sdk/interfaces/objects/index.js";
import {
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  MarketplaceListing,
  MarketplaceTag,
  TBlockchainCommonErrors,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

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
    TBlockchainCommonErrors | ConsentFactoryContractError
  >;

  /**
   *  Return the number Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError | TBlockchainCommonErrors>;

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
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  /**
   *  Return the an array of Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  /**
   *  Return the number Consent addresses that user has specific roles for
   * @param ownerAddress Address of the user
   * @param role The queried role
   */
  getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError | TBlockchainCommonErrors>;

  /**
   *  Return the an array of Consent addresses that user has specific roles for
   * @param ownerAddress Address of the user
   * @param role The queried role
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  /**
   *  Return Consent addresses by checking ContractDeployed event logs
   */
  getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  /**
   * Marketplace Listings
   */
  getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  setListingDuration(
    listingDuration: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | ConsentFactoryContractError
  >;

  setMaxTagsPerListing(
    maxTagsPerListing: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | ConsentFactoryContractError
  >;

  adminRemoveListing(
    tag: MarketplaceTag,
    removedSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | ConsentFactoryContractError
  >;

  getListingDetail(
    tag: MarketplaceTag,
    slot: BigNumberString,
  ): ResultAsync<
    MarketplaceListing,
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  getListingsForward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  getListingsBackward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  getTagTotal(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError | TBlockchainCommonErrors>;

  /**
   *  Return the list of marketplace listings of a specific tag
   * @param tag marketplace tag string
   */
  getListingsByTag(
    tag: MarketplaceTag,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | TBlockchainCommonErrors
  >;

  getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError>;
}
