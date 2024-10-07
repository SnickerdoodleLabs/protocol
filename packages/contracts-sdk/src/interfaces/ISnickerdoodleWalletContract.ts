import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  EVMAccountAddress,
  HexString32,
  JSONString,
  PasskeyId,
} from "@snickerdoodlelabs/objects";
import { BytesLike } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISnickerdoodleWalletContract extends IBaseContract {
  isOperator(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<
    boolean,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  >;

  addP256KeyWithP256Key(
    keyId: PasskeyId,
    authenticatorData: BytesLike,
    clientDataJSONLeft: JSONString,
    newKeyId: PasskeyId,
    qx: HexString32,
    qy: HexString32,
    clientDataJSONRight: JSONString,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  addEMVAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorData: BytesLike,
    clientDataJSONLeft: JSONString,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    clientDataJSONRight: JSONString,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  addEVMAccountWithEVMAccount(
    evmAccount: EVMAccountAddress | EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  withdrawLocalERC20Asset(
    tokenAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;
}

export const ISnickerdoodleWalletFactoryType = Symbol.for(
  "ISnickerdoodleWalletFactory",
);
