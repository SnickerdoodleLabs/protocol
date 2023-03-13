import {
  Listing,
  ListingSlot,
  TagSlot,
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

  listingsTotal(): ResultAsync<number, ConsentFactoryContractError>;

  listingsHead(): ResultAsync<number, ConsentFactoryContractError>;

  getMarketplaceListings(
    count?: number,
    headAt?: number,
  ): ResultAsync<MarketplaceListing, ConsentFactoryContractError>;

  getNumberOfListings(
    tag: string,
  ): ResultAsync<number, ConsentFactoryContractError>;

  getListingDuration(): ResultAsync<number, ConsentFactoryContractError>;

  setListingDuration(
    listingDuration: bigint,
  ): ResultAsync<void, ConsentFactoryContractError>;

  setMaxTagsPerListing(
    maxTagsPerListing: number,
  ): ResultAsync<void, ConsentFactoryContractError>;

  initializeTag(
    tag: string,
    newHead: TagSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  insertUpstream(
    tag: string,
    newSlot: ListingSlot,
    existingSlot: ListingSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  insertDownstream(
    tag: string,
    existingSlot: ListingSlot,
    newSlot: ListingSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  replaceExpiredListing(
    tag: string,
    slot: ListingSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  removeListing(
    tag: string,
    removedSlot: ListingSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  adminRemoveListing(
    tag: string,
    removedSlot: ListingSlot,
  ): ResultAsync<void, ConsentFactoryContractError>;

  getListingDetail(
    tag: string,
    slot: ListingSlot,
  ): ResultAsync<Listing, ConsentFactoryContractError>;

  getListingsForward(
    tag: string,
    startingSlot: ListingSlot,
    numberOfSlots: ListingSlot,
  ): ResultAsync<Listing[], ConsentFactoryContractError>;

  getListingsBackward(
    tag: string,
    startingSlot: ListingSlot,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<Listing[], ConsentFactoryContractError>;

  getTagTotal(tag: string): ResultAsync<number, ConsentFactoryContractError>;
}
