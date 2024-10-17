import {
  EVMAccountAddress,
  BlockchainCommonErrors,
  OFT20RewardContractError,
  ERC7529ContractError,
  EVMContractAddress,
  TokenAmount,
  DomainName,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import {
  IBaseContract,
  IERC7529Contract,
  IRBCContract,
  ContractOverrides,
  WrappedTransactionResponse,
  IERC20RewardContract,
} from "@contracts-sdk/interfaces/index.js";

export interface IOFT20RewardContract
  extends IBaseContract,
    IERC7529Contract<OFT20RewardContractError>,
    IRBCContract<OFT20RewardContractError> {
  /**
   * Returns the name of the ERC20 token
   */
  name(): ResultAsync<
    string,
    OFT20RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the symbol of the ERC20 token
   */
  symbol(): ResultAsync<
    string,
    OFT20RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the decimals of the ERC20 token
   */
  decimals(): ResultAsync<
    number,
    OFT20RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the total supply of the ERC20 token
   */
  totalSupply(): ResultAsync<
    bigint,
    OFT20RewardContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the token balance of the EOA / contract address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, OFT20RewardContractError | BlockchainCommonErrors>;

  /**
   * Returns the spending allowance of the EOA / contract address
   * @param owner owner address
   *  @param spender spender address
   */
  allowance(
    owner: EVMAccountAddress | EVMContractAddress,
    spender: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, OFT20RewardContractError | BlockchainCommonErrors>;

  /**
   * Allows caller to approve an amount of tokens for spender to transfer
   * @param spender spender address
   *  @param amount amount of tokens to approve
   */
  approve(
    spender: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  >;

  /**
   * Allows caller to transfer an amount of tokens to a recipient
   * @param recipient spender address
   *  @param amount amount of tokens to approve
   */
  transfer(
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  >;

  /**
   * To transfer an amount of tokens from sender to recipient
   * @param sender sender address
   * @param recipient spender address
   *  @param amount amount of tokens to approve
   */
  transferFrom(
    sender: EVMAccountAddress | EVMContractAddress,
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  >;

  redeem(
    account: EVMAccountAddress,
    amount: TokenAmount,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  >;

  filters: IOFT20RewardFilters;
}

// TODO: Add crossChain function call when feature is needed.

export interface IOFT20RewardFilters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): ethers.DeferredTopicFilter;
}

export const IOFT20RewardContractType = Symbol.for("IOFT20RewardContract");
