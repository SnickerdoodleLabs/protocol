import {
  EVMAccountAddress,
  BlockchainCommonErrors,
  ERC20ContractError,
  EVMContractAddress,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IERC20Contract extends IBaseContract {
  /**
   * Returns the name of the ERC20 token
   */
  name(): ResultAsync<string, ERC20ContractError | BlockchainCommonErrors>;

  /**
   * Returns the symbol of the ERC20 token
   */
  symbol(): ResultAsync<string, ERC20ContractError | BlockchainCommonErrors>;

  /**
   * Returns the decimals of the ERC20 token
   */
  decimals(): ResultAsync<number, ERC20ContractError | BlockchainCommonErrors>;

  /**
   * Returns the total supply of the ERC20 token
   */
  totalSupply(): ResultAsync<
    bigint,
    ERC20ContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the token balance of the EOA / contract address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, ERC20ContractError | BlockchainCommonErrors>;

  /**
   * Returns the spending allowance of the EOA / contract address
   * @param owner owner address
   *  @param spender spender address
   */
  allowance(
    owner: EVMAccountAddress | EVMContractAddress,
    spender: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, ERC20ContractError | BlockchainCommonErrors>;

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
    BlockchainCommonErrors | ERC20ContractError
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
    BlockchainCommonErrors | ERC20ContractError
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
    BlockchainCommonErrors | ERC20ContractError
  >;

  filters: IERC20Filters;
}

export interface IERC20Filters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): ethers.DeferredTopicFilter;
}

export const IERC20ContractType = Symbol.for("IERC20Contract");
