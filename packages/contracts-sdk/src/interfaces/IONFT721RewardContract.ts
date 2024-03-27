import {
  ONFT721RewardContractError,
  EVMAccountAddress,
  TokenId,
  TokenUri,
  BaseURI,
  BlockchainCommonErrors,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums/index.js";
import {
  IBaseContract,
  IRBCContract,
  IERC7529Contract,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IONFT721RewardContract
  extends IBaseContract,
    IERC7529Contract<ONFT721RewardContractError>,
    IRBCContract<ONFT721RewardContractError> {
  getOwner(): ResultAsync<
    EVMAccountAddress,
    ONFT721RewardContractError | BlockchainCommonErrors
  >;

  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ONFT721RewardContractError | BlockchainCommonErrors
  >;

  getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ONFT721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the number of Reward tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ONFT721RewardContractError | BlockchainCommonErrors>;

  /**
   * Returns the owner account for a token Id
   * @param tokenId token Id
   */
  ownerOf(
    tokenId: TokenId,
  ): ResultAsync<
    EVMAccountAddress,
    ONFT721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ONFT721RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the baseURI of the Reward contract
   */
  baseURI(): ResultAsync<
    BaseURI,
    ONFT721RewardContractError | BlockchainCommonErrors
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
    BlockchainCommonErrors | ONFT721RewardContractError
  >;

  filters: IONFT721Filters;

  /**
   * Returns if operatorToApprove is approved to transfer tokens that belong to tokenOwnerAddress
   */
  isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ONFT721RewardContractError | BlockchainCommonErrors>;

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
    BlockchainCommonErrors | ONFT721RewardContractError
  >;

  /**
   * Allows the escrow wallet to transfer NFTs to reward receiver after they have been approvedForAll by the token owner
   */
  safeTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ONFT721RewardContractError
  >;
}

export interface IONFT721Filters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): ethers.DeferredTopicFilter;
}

export const IONFT721RewardContractType = Symbol.for("IONFT721RewardContract");
