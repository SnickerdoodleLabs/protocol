import {
  ERC1155ContractError,
  EVMAccountAddress,
  TokenId,
  TokenUri,
  BaseURI,
  BlockchainCommonErrors,
  DomainName,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IERC1155RewardContract extends IBaseContract {
  getOwner(): ResultAsync<
    EVMAccountAddress,
    ERC1155ContractError | BlockchainCommonErrors
  >;

  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC1155ContractError | BlockchainCommonErrors
  >;

  getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC1155ContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the balance for a given token id for an address
   * */
  balanceOf(
    address: EVMAccountAddress,
    tokenId: TokenId,
  ): ResultAsync<number, ERC1155ContractError | BlockchainCommonErrors>;

  /**
   * Returns the balances for a list of token ids and addresses
   * */
  balanceOfBatch(
    addresses: EVMAccountAddress[],
    tokenIds: TokenId[],
  ): ResultAsync<number[], ERC1155ContractError | BlockchainCommonErrors>;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ERC1155ContractError | BlockchainCommonErrors
  >;

  /**
   * Sets a new URI for a given token id on the Reward contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Reward contract
   */
  setTokenURI(
    tokenId: TokenId,
    newURI: TokenUri,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  >;

  /**
   * Checks if an address has a specific role in the Reward contract
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors>;

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
    BlockchainCommonErrors | ERC1155ContractError
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
    BlockchainCommonErrors | ERC1155ContractError
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
    BlockchainCommonErrors | ERC1155ContractError
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
    BlockchainCommonErrors | ERC1155ContractError
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
    BlockchainCommonErrors | ERC1155ContractError
  >;

  /**
   * Returns an array of domains added to the contract
   */
  getDomains(): ResultAsync<
    DomainName[],
    BlockchainCommonErrors | ERC1155ContractError
  >;

  filters: IERC1155Filters;

  /**
   * Returns if operatorToApprove is approved to transfer tokens that belong to tokenOwnerAddress
   */
  isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors>;

  /**
   * Allows the token owner to approve the escrow wallet to transfer all token ids he owns on this rewards contract
   * NOTE: To support this, the user would need to connect their external wallet that owns the NFTs to sign the approval txs
   */
  setApproveForAll(
    addressToApprove: EVMAccountAddress,
    approved: boolean,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  >;

  /**
   * Allows the escrow wallet to transfer NFTs to reward receiver after they have been approvedForAll by the token owner
   */
  safeTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenId: TokenId,
    amount: TokenAmount,
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  >;

  /**
   * Allows the escrow wallet to transfer a batch of NFTs to reward receiver after they have been approvedForAll by the token owner
   */
  safeBatchTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenIds: TokenId[],
    amounts: TokenAmount[],
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  >;

  /**
   * Returns the supply of a given token id
   */
  totalSupply(
    tokenId: TokenId,
  ): ResultAsync<bigint, ERC1155ContractError | BlockchainCommonErrors>;

  /**
   * Returns a boolean to indicate if a token id exists or not - part of ERC1155Supply extension, it checks if the totalSupply > 0
   */
  exists(
    tokenId: TokenId,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors>;

  /**
   * Function for the DEFAULT_ADMIN_ROLE to create a new token id type, purpose is to add new reward types if needed
   * */
  createNewTokens(
    newURIs: TokenUri[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  >;
}

export interface IERC1155Filters {
  TransferSingle(
    operatorAddress: EVMAccountAddress | null,
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
    tokenId: TokenId | null,
    value: bigint,
  ): ethers.DeferredTopicFilter;
}

export const IERC1155RewardContractType = Symbol.for("IERC1155RewardContract");
