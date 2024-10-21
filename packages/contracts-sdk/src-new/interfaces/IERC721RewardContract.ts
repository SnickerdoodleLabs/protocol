import {
  ERC721RewardContractError,
  EVMAccountAddress,
  TokenId,
  TokenUri,
  BaseURI,
  BlockchainCommonErrors,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums";
import {
  IBaseContract,
  IRBCContract,
  IERC7529Contract,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IERC721RewardContract
  extends IBaseContract,
    IERC7529Contract<ERC721RewardContractError>,
    IRBCContract<ERC721RewardContractError> {
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

  filters: IERC721Filters;

  /**
   * Returns if operatorToApprove is approved to transfer tokens that belong to tokenOwnerAddress
   */
  isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError | BlockchainCommonErrors>;

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
    BlockchainCommonErrors | ERC721RewardContractError
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
    BlockchainCommonErrors | ERC721RewardContractError
  >;
}

export interface IERC721Filters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): ethers.DeferredTopicFilter;
}

export const IERC721RewardContractType = Symbol.for("IERC721RewardContract");
