import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  EVMAccountAddress,
  WebauthnCredentialId,
  P256PublicKeyComponents,
  P256SignatureComponents,
  InvalidParametersError,
  ClientDataJSONComponents,
  AuthenticatorData,
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
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
    keyId: WebauthnCredentialId,
    authenticatorData: AuthenticatorData,
    clientJSONData: ClientDataJSONComponents,
    newP256Key: P256PublicKeyComponents,
    p256Signature: P256SignatureComponents,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  generateAddP256KeyWithP256KeyChallenge(
    newKeyId: WebauthnCredentialId,
    newP256PublicKey: P256PublicKeyComponents,
  ): Result<string, InvalidParametersError>;

  addEVMAddressWithP256Key(
    keyId: WebauthnCredentialId,
    authenticatorData: AuthenticatorData,
    clientJSONData: ClientDataJSONComponents,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    p256Signature: P256SignatureComponents,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  generateAddEVMAddressWithP256KeyChallenge(
    evmAccountAddress: EVMAccountAddress,
  ): Result<string, InvalidParametersError>;

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
