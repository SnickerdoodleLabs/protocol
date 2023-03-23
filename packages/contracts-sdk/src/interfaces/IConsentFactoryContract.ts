import {
  Listing,
  ListingSlot,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import { ConsentRoles } from "@contracts-sdk/interfaces/objects/ConsentRoles";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import {
  BaseURI,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  MarketplaceListing,
  MarketplaceTag,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentFactoryContract {
  /**
   * Return contract address
   */
  getContractAddress(): EVMContractAddress;

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
  ): ResultAsync<EVMContractAddress, ConsentFactoryContractError>;

  /**
   *  Return the number Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError>;

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
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  /**
   *  Return the an array of Consent addresses that user has deployed
   * @param ownerAddress Address of the user
   */
  getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  /**
   *  Return the number Consent addresses that user has specific roles for
   * @param ownerAddress Address of the user
   * @param role The queried role
   */
  getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError>;

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
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  /**
   *  Return Consent addresses by checking ContractDeployed event logs
   */
  getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError
  >;

  /**
   * Marketplace Listings
   */
  getMaxTagsPerListing(): ResultAsync<number, ConsentFactoryContractError>;

  getNumberOfListings(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError>;

  getListingDuration(): ResultAsync<number, ConsentFactoryContractError>;

  setListingDuration(
    listingDuration: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  setMaxTagsPerListing(
    maxTagsPerListing: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  initializeTag(
    tag: MarketplaceTag,
    newHead: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  insertUpstream(
    tag: MarketplaceTag,
    newSlot: ListingSlot,
    existingSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  insertDownstream(
    tag: MarketplaceTag,
    existingSlot: ListingSlot,
    newSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  replaceExpiredListing(
    tag: MarketplaceTag,
    slot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  removeListing(
    tag: MarketplaceTag,
    removedSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  adminRemoveListing(
    tag: MarketplaceTag,
    removedSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError>;

  getListingDetail(
    tag: MarketplaceTag,
    slot: ListingSlot,
  ): ResultAsync<Listing, ConsentFactoryContractError>;

  getListingsForward(
    tag: MarketplaceTag,
    startingSlot: ListingSlot,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<Listing[], ConsentFactoryContractError>;

  getListingsBackward(
    tag: MarketplaceTag,
    startingSlot: ListingSlot,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<Listing[], ConsentFactoryContractError>;

  getTagTotal(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError>;
}
