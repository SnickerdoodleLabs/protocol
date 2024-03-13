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
  Commitment,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { EConsentRoles } from "@contracts-sdk/interfaces/enums/index.js";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { IERC7529Contract } from "@contracts-sdk/interfaces/IERC7529Contract.js";
import {
  ContractOverrides,
  Tag,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IConsentContract
  extends IBaseContract,
    IERC7529Contract<ConsentContractError> {
  /**
   * Create a consent token owned by the signer
   * @param commitment Commitment generated by the data wallet that wants to opt in. Consists of the hash of their identity nullifier and
   * @param overrides for overriding transaction gas object
   */
  optIn(
    commitment: Commitment,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Opts in to a private contract, using a signature provided by an account with the SIGNER role.
   * The signature must encode the contract address, token ID AND the recipient account address.
   * anonymousRestrictedOptIn uses a slightly different formula and does not encode the recipient
   * account address
   * @param commitment Generated by the data wallet
   * @param nonce The invitation nonce
   * @param signature business or consent contract owner signature
   * @param overrides for overriding transaction gas object
   */
  restrictedOptIn(
    commitment: Commitment,
    nonce: TokenId,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

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
   * Returns a topic event object that can be fetched for events logs
   * @param eventFilter event filer
   * @param fromBlock optional parameter of starting block to query
   * @param toBlock optional parameter of ending block to query
   */
  queryFilter(
    eventFilter: ethers.ContractEventName,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    (ethers.EventLog | ethers.Log)[],
    ConsentContractError | BlockchainCommonErrors
  >;

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
   * @param role string that is a key defined in EConsentRoles enum
   * @param address Address to use
   */
  hasRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in EConsentRoles enum
   * @param address Address to use
   */
  grantRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in EConsentRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  >;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in EConsentRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: EConsentRoles,
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

  // Returns the index of the commitment, or 0 if it's not found
  checkCommitments(
    commitments: Commitment[],
  ): ResultAsync<number[], ConsentContractError | BlockchainCommonErrors>;

  checkNonces(
    nonces: TokenId[],
  ): ResultAsync<boolean[], ConsentContractError | BlockchainCommonErrors>;

  fetchAnonymitySet(
    start: BigNumberString,
    stop: BigNumberString,
  ): ResultAsync<Commitment[], BlockchainCommonErrors | ConsentContractError>;

  estimateGasLimitForSetQueryHorizon(
    blockNumber: BlockNumber,
    overrides?: ContractOverrides,
  ): ResultAsync<
    BigNumberString,
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
      bigint | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError>;

  filters: IConsentContractFilters;

  /**
   * Marketplace functions
   */
  getStakingToken(): ResultAsync<
    EVMContractAddress,
    ConsentContractError | BlockchainCommonErrors
  >;

  tagIndices(
    tag: string,
  ): ResultAsync<
    BigNumberString,
    ConsentContractError | BlockchainCommonErrors
  >;

  updateMaxTagsLimit(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
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

  restakeExpiredListing(
    tag: string,
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
  ): ethers.DeferredTopicFilter;

  RequestForData(ownerAddress: EVMAccountAddress): ethers.DeferredTopicFilter;
}

export const IConsentContractType = Symbol.for("IConsentContract");
