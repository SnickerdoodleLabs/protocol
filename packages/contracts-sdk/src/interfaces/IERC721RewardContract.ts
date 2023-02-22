import { ERewardRoles } from "@contracts-sdk/interfaces/enums";
import {
  ERC721RewardContractError,
  EVMAccountAddress,
  TokenId,
  TokenUri,
  BaseURI,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event, BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IERC721RewardContract {
  getContractAddress(): EVMContractAddress;

  getOwner(): ResultAsync<EVMAccountAddress, ERC721RewardContractError>;

  getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError
  >;

  getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError
  >;

  /**
   * Returns the number of Reward tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ERC721RewardContractError>;

  /**
   * Returns the owner account for a token Id
   * @param tokenId token Id
   */
  ownerOf(
    tokenId: TokenId,
  ): ResultAsync<EVMAccountAddress, ERC721RewardContractError>;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, ERC721RewardContractError>;

  /**
   * Returns the baseURI of the Reward contract
   */
  baseURI(): ResultAsync<BaseURI, ERC721RewardContractError>;

  /**
   * Sets a new baseURI for the Reward contract
   * Only callable by addresses that have the DEFAULT_ADMIN_ROLE on the Reward contract
   */
  setBaseURI(baseUri: BaseURI): ResultAsync<void, ERC721RewardContractError>;

  /**
   * Checks if an address has a specific role in the Reward contract
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError>;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError>;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError>;

  filters: IERC721Filters;
}

export interface IERC721Filters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): EventFilter;
}

export const IERC721RewardContractType = Symbol.for("IERC721RewardContract");
