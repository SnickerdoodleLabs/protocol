import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  EVMAccountAddress,
  PasskeyId,
  P256PublicKeyComponent,
  P256SignatureComponent,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  AuthenticatorData,
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISnickerdoodleWalletContract extends IBaseContract {
  factoryAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  >;

  operatorAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  >;

  addP256KeyWithP256Key(
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    newP256Key: P256PublicKeyComponent,
    p256Signature: P256SignatureComponent,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  addEVMAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    p256Signature: P256SignatureComponent,
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

  removeEVMAccountWithEVMAccount(
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
