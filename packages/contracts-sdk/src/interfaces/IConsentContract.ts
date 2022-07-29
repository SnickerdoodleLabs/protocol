import {
  ConsentContractError,
  EVMAccountAddress,
  IpfsCID,
  TokenId,
  TokenUri,
  Signature,
  ConsentToken,
  RequestForData,
  BlockNumber,
  DomainName,
  BaseURI,
  HexString,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event } from "ethers";
import { ResultAsync } from "neverthrow";

import {
  ConsentRoles,
  ContractOverrides,
} from "@contracts-sdk/interfaces/objects";

export interface IConsentContract {
  /**
   * Create a consent token owned by the signer
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param contractOverrides for overriding transaction gas object
   */
  optIn(
    tokenId: TokenId,
    agreementURI: TokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  encodeOptIn(tokenId: TokenId, agreementURI: TokenUri): HexString;

  /**
   * Create a consent token with providing the business signature
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param signature business or consent contract owner signature
   * @param contractOverrides for overriding transaction gas object
   */
  restrictedOptIn(
    tokenId: TokenId,
    agreementURI: TokenUri,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Create a consent token with providing the business signature
   * Allows Signature Issuer to send anonymous invitation link to end user to opt in
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param signature business or consent contract owner signature
   * @param contractOverrides for overriding transaction gas object
   */
  anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementURI: TokenUri,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Burns a user's consent token to opt out of Consent contract
   * @param tokenId Token id to opt out for
   */
  optOut(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  encodeOptOut(tokenId: TokenId): HexString;

  /**
   * Submit for blockchain requestForData event
   * @param ipfsCID ipfs conent id of a query
   */
  requestForData(ipfsCID: IpfsCID): ResultAsync<void, ConsentContractError>;

  /**
   * Returns array of addresses that has the DEFAULT_ADMIN_ROLE
   * Address at index 0 of the returned array is the contract owner
   */
  getConsentOwner(): ResultAsync<EVMAccountAddress, ConsentContractError>;

  /**
   * Returns array of addresses that has the DEFAULT_ADMIN_ROLE
   * Address at index 0 of the returned array is the contract owner
   */
  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  >;

  /**
   * Returns array of addresses that has the SIGNER_ROLE
   */
  getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  >;

  /**
   * Returns array of addresses that has the PAUSER_ROLE
   */
  getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  >;

  /**
   * Returns array of addresses that has the REQUESTER_ROLE
   */
  getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  >;

  /**
   * Returns the number of consent tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError>;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, ConsentContractError>;

  /**
   * Returns a topic event object that can be fetched for events logs
   * @param eventFilter event filer
   * @param fromBlock optional parameter of starting block to query
   * @param toBlock optional parameter of ending block to query
   */
  queryFilter(
    eventFilter: EventFilter,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<Event[], ConsentContractError>;

  /**
   * Returns a consent tokens owned by address
   * @param ownerAddress owner address
   */
  getConsentTokensOfAddress(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError>;

  /**
   * Adds a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Consent : Domain already added"
   * @param domain Domain name
   */
  addDomain(domain: string): ResultAsync<void, ConsentContractError>;

  /**
   * Removes a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain does not exist, reverts with error message "Consent : Domain is not in the list"
   * @param domain Domain name
   */
  removeDomain(domain: string): ResultAsync<void, ConsentContractError>;

  /**
   * Returns an array of domains added to the contract
   */
  getDomains(): ResultAsync<DomainName[], ConsentContractError>;

  /**
   * Returns a list of RequestForData events between two block numbers
   * @param requesterAddress owner address of the request
   * @param fromBlock from block number
   * @param toBlock to block number
   */
  getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<RequestForData[], ConsentContractError>;

  /**
   * Disables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  disableOpenOptIn(): ResultAsync<void, ConsentContractError>;

  /**
   * Enables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  enableOpenOptIn(): ResultAsync<void, ConsentContractError>;

  /**
   * Returns the baseURI of the Consent contract
   */
  baseURI(): ResultAsync<BaseURI, ConsentContractError>;

  /**
   * Sets a new baseURI for the Consent contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Consent contract
   */
  setBaseURI(baseUri: BaseURI): ResultAsync<void, ConsentContractError>;

  /**
   * Checks if an address has a specific role in the Consent contract
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  grantRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError>;

  filters: IConsentContractFilters;
}

export interface IConsentContractFilters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): EventFilter;

  RequestForData(ownerAddress: EVMAccountAddress): EventFilter;
}

export const IConsentContractType = Symbol.for("IConsentContract");
