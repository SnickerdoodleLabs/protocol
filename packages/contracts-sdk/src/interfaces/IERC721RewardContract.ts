import {
  ERC721RewardContractError,
  EVMAccountAddress,
  TokenId,
  TokenUri,
  BaseURI,
  BlockchainCommonErrors,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { EventFilter } from "ethers";
import { ResultAsync } from "neverthrow";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IERC721RewardContract extends IBaseContract {
  getOwner(): ResultAsync<
    EVMAccountAddress,
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the number of Reward tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ERC721RewardContractError | BlockchainCommonErrors>;

  /**
   * Returns the owner account for a token Id
   * @param tokenId token Id
   */
  ownerOf(
    tokenId: TokenId,
  ): ResultAsync<
    EVMAccountAddress,
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the baseURI of the Reward contract
   */
  baseURI(): ResultAsync<
    BaseURI,
    ERC721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Sets a new baseURI for the Reward contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Reward contract
   */
  setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Checks if an address has a specific role in the Reward contract
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError | BlockchainCommonErrors>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Adds a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Reward : Domain already added"
   * @param domain Domain name
   */
  addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Removes a domain from the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain does not exist, reverts with error message "Reward : Domain is not in the list"
   * @param domain Domain name
   */
  removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Returns an array of domains added to the contract
   */
  getDomains(): ResultAsync<
    DomainName[],
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  filters: IERC721Filters;

  /**
   * Returns if operatorToApprove is approved to transfer tokens that belong to tokenOwnerAddress
   */
  isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError | BlockchainCommonErrors>;

  /**
   * Allows the caller to approve addressToApprove to transfer all their tokens
   */
  setApproveForAll(
    addressToApprove: EVMAccountAddress,
    approved: boolean,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;

  /**
   * Allows the escrow wallet to call
   */
  safeTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC721RewardContractError
  >;
}

export interface IERC721Filters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): EventFilter;
}

export const IERC721RewardContractType = Symbol.for("IERC721RewardContract");
