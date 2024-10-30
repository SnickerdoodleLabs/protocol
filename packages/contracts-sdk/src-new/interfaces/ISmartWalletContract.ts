import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SmartWalletContractError,
  EVMAccountAddress,
  TokenAmount,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISmartWalletContract extends IBaseContract {
  getOwner(): ResultAsync<
    string,
    SmartWalletContractError | BlockchainCommonErrors
  >;

  withdrawAllNativeTokenBalance(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  >;
  transferERC20(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  >;

  transferERC721(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  >;

  transferERC1155(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    tokenId: TokenId,
    amount: TokenAmount,
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  >;
}

export const ISmartWalletFactoryType = Symbol.for("ISmartWalletFactory");
