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
  EVMContractAddress,
  HexString32,
  InvalidParametersError,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event, BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

import {
  ConsentRoles,
  ContractOverrides,
  Tag,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IConsentContract {
  getContractAddress(): EVMContractAddress;

  /**
   * Create a consent token owned by the signer
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param contractOverrides for overriding transaction gas object
   */
  optIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  encodeOptIn(tokenId: TokenId, agreementFlags: HexString32): HexString;

  /**
   * Opts in to a private contract, using a signature provided by an account with the SIGNER role.
   * The signature must encode the contract address, token ID AND the recipient account address.
   * anonymousRestrictedOptIn uses a slightly different formula and does not encode the recipient
   * account address
   * @param tokenId randomly generated token id
   * @param agreementFlags token uri data
   * @param signature business or consent contract owner signature
   * @param contractOverrides for overriding transaction gas object
   */
  restrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  encodeRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString;

  /**
   * Opts in to a private contract, using a signature provided by an account with the SIGNER role.
   * The signature must encode the contract address and token ID, but not the recipient address.
   * account address
   * @param tokenId randomly generated token id
   * @param agreementFlags token uri data
   * @param signature business or consent contract owner signature
   * @param contractOverrides for overriding transaction gas object
   */
  anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  encodeAnonymousRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString;

  /**
   * Burns a user's consent token to opt out of Consent contract
   * @param tokenId Token id to opt out for
   */
  optOut(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;
  encodeOptOut(tokenId: TokenId): HexString;

  /**
   * Returns the agreementFlagsArray value for the token ID
   * @param tokenId
   */
  agreementFlags(
    tokenId: TokenId,
  ): ResultAsync<HexString32, ConsentContractError>;

  getMaxCapacity(): ResultAsync<number, ConsentContractError>;
  updateMaxCapacity(
    maxCapacity: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  updateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
  ): ResultAsync<void, ConsentContractError>;

  encodeUpdateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
  ): HexString;

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
   * Returns the owner account for a token Id
   * @param tokenId token Id
   */
  ownerOf(
    tokenId: TokenId,
  ): ResultAsync<EVMAccountAddress, ConsentContractError>;

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
   * Returns a consent token by the token ID
   * @param ownerAddress owner address
   */
  getConsentToken(
    tokenId: TokenId,
  ): ResultAsync<ConsentToken, ConsentContractError>;

  /**
   * Adds a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Consent : Domain already added"
   * @param domain Domain name
   */
  addDomain(
    domain: string,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  /**
   * Removes a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain does not exist, reverts with error message "Consent : Domain is not in the list"
   * @param domain Domain name
   */
  removeDomain(
    domain: string,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

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
   * Returns the tokenId of latest opt-in contract the user has
   * for given derived opt-in address.
   * @param optInAddress Opt-in contract address
   */
  getLatestTokenIdByOptInAddress(
    optInAddress: EVMAccountAddress,
  ): ResultAsync<TokenId | null, ConsentContractError>;

  /**
   * Disables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  disableOpenOptIn(): ResultAsync<
    WrappedTransactionResponse,
    ConsentContractError
  >;

  /**
   * Enables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  enableOpenOptIn(): ResultAsync<
    WrappedTransactionResponse,
    ConsentContractError
  >;

  /**
   * Returns the baseURI of the Consent contract
   */
  baseURI(): ResultAsync<BaseURI, ConsentContractError>;

  /**
   * Sets a new baseURI for the Consent contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Consent contract
   */
  setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

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
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  /**
   * Returns the earliest block that should be looked at for requestForData events
   */
  getQueryHorizon(): ResultAsync<BlockNumber, ConsentContractError>;

  /**
   * Sets the earliest block that should ever be looked at for requestForData events.
   * This should be periodically updated to prevent very old queries from getting looked at.
   * The update policy depends on how a particular ConsentContract is used and the expiration
   * dates of the attached queries.
   * @param blockNumber
   */
  setQueryHorizon(
    blockNumber: BlockNumber,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  /**
   * Get the number of opted in addresses
   */
  totalSupply(): ResultAsync<number, ConsentContractError>;

  /**
   * Get the open optIn availability
   */
  openOptInDisabled(): ResultAsync<boolean, ConsentContractError>;

  getSignature(
    values: Array<
      BigNumber | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError>;

  filters: IConsentContractFilters;

  /**
   * Marketplace functions
   */
  getMaxTags(): ResultAsync<number, ConsentContractError>;

  getNumberOfStakedTags(): ResultAsync<number, ConsentContractError>;

  getTagArray(): ResultAsync<Tag[], ConsentContractError>;

  newGlobalTag(
    tag: string,
    newSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  newLocalTagUpstream(
    tag: string,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  newLocalTagDownstream(
    tag: string,
    existingSlot: BigNumberString,
    newSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  replaceExpiredListing(
    tag: string,
    slot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;

  removeListing(
    tag: string,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError>;
}

export interface IConsentContractFilters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): EventFilter;

  RequestForData(ownerAddress: EVMAccountAddress): EventFilter;
}

export const IConsentContractType = Symbol.for("IConsentContract");
