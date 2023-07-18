import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ConsentRoles,
  ContractOverrides,
  Tag,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
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
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event, BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IConsentContract extends IBaseContract {
  /**
   * Create a consent token owned by the signer
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param overrides for overriding transaction gas object
   */
  optIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  encodeOptIn(tokenId: TokenId, agreementFlags: HexString32): HexString;

  /**
   * Opts in to a private contract, using a signature provided by an account with the SIGNER role.
   * The signature must encode the contract address, token ID AND the recipient account address.
   * anonymousRestrictedOptIn uses a slightly different formula and does not encode the recipient
   * account address
   * @param tokenId randomly generated token id
   * @param agreementFlags token uri data
   * @param signature business or consent contract owner signature
   * @param overrides for overriding transaction gas object
   */
  restrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

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
   * @param overrides for overriding transaction gas object
   */
  anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

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
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;
  encodeOptOut(tokenId: TokenId): HexString;

  /**
   * Returns the agreementFlagsArray value for the token ID
   * @param tokenId
   */
  agreementFlags(
    tokenId: TokenId,
  ): ResultAsync<HexString32, ConsentContractError | BlockchainCommonErrors>;

  getMaxCapacity(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  >;

  updateMaxCapacity(
    maxCapacity: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  updateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  encodeUpdateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
  ): HexString;

  /**
   * Submit for blockchain requestForData event
   * @param ipfsCID ipfs conent id of a query
   */
  requestForData(
    ipfsCID: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Returns array of addresses that has the DEFAULT_ADMIN_ROLE
   * Address at index 0 of the returned array is the contract owner
   */
  getConsentOwner(): ResultAsync<
    EVMAccountAddress,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns array of addresses that has the DEFAULT_ADMIN_ROLE
   * Address at index 0 of the returned array is the contract owner
   */
  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns array of addresses that has the SIGNER_ROLE
   */
  getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns array of addresses that has the PAUSER_ROLE
   */
  getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns array of addresses that has the REQUESTER_ROLE
   */
  getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the number of consent tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError | BlockchainCommonErrors>;

  /**
   * Returns the owner account for a token Id
   * @param tokenId token Id
   */
  ownerOf(
    tokenId: TokenId,
  ): ResultAsync<
    EVMAccountAddress,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ConsentContractError | BlockchainCommonErrors
  >;

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
  ): ResultAsync<Event[], ConsentContractError | BlockchainCommonErrors>;

  /**
   * Returns a consent token by the token ID
   * @param ownerAddress owner address
   */
  getConsentToken(
    tokenId: TokenId,
  ): ResultAsync<ConsentToken, ConsentContractError | BlockchainCommonErrors>;

  /**
   * Adds a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Consent : Domain already added"
   * @param domain Domain name
   */
  addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Removes a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain does not exist, reverts with error message "Consent : Domain is not in the list"
   * @param domain Domain name
   */
  removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Returns an array of domains added to the contract
   */
  getDomains(): ResultAsync<
    DomainName[],
    ConsentContractError | BlockchainCommonErrors
  >;

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
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the tokenId of latest opt-in contract the user has
   * for given derived opt-in address.
   * @param optInAddress Opt-in contract address
   */
  getLatestTokenIdByOptInAddress(
    optInAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Disables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  disableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Enables open opt ins on the contract
   * Only callable by addresses that have the PAUSER_ROLE on the Consent contract
   */
  enableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Returns the baseURI of the Consent contract
   */
  baseURI(): ResultAsync<
    BaseURI,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Sets a new baseURI for the Consent contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Consent contract
   */
  setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Checks if an address has a specific role in the Consent contract
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  grantRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in ConsentRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Returns the earliest block that should be looked at for requestForData events
   */
  getQueryHorizon(): ResultAsync<
    BlockNumber,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Sets the earliest block that should ever be looked at for requestForData events.
   * This should be periodically updated to prevent very old queries from getting looked at.
   * The update policy depends on how a particular ConsentContract is used and the expiration
   * dates of the attached queries.
   * @param blockNumber
   */
  setQueryHorizon(
    blockNumber: BlockNumber,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Get the number of opted in addresses
   */
  totalSupply(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  >;

  /**
   * Get the open optIn availability
   */
  openOptInDisabled(): ResultAsync<
    boolean,
    ConsentContractError | BlockchainCommonErrors
  >;

  getSignature(
    values: Array<
      BigNumber | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError>;

  filters: IConsentContractFilters;

  /**
   * Marketplace functions
   */
  getMaxTags(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  >;

  getNumberOfStakedTags(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  >;

  getTagArray(): ResultAsync<
    Tag[],
    ConsentContractError | BlockchainCommonErrors
  >;

  newGlobalTag(
    tag: string,
    newSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  newLocalTagUpstream(
    tag: string,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  newLocalTagDownstream(
    tag: string,
    existingSlot: BigNumberString,
    newSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  replaceExpiredListing(
    tag: string,
    slot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  removeListing(
    tag: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;
}

export interface IConsentContractFilters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): EventFilter;

  RequestForData(ownerAddress: EVMAccountAddress): EventFilter;
}

export const IConsentContractType = Symbol.for("IConsentContract");
