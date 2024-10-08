import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  EVMAccountAddress,
  HexString32,
  JSONString,
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@snickerdoodlelabs/objects";
import { BytesLike } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  AuthenticatorData,
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
    authenticatorData: AuthenticatorData,
    newKeyId: PasskeyId,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  addEVMAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorAndClientData: AuthenticatorData,
    evmAccount: EVMAccountAddress | EVMContractAddress,
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
