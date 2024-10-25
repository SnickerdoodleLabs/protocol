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
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  AuthenticatorData,
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import { Client } from "@farcaster/hub-nodejs";

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
    authenticatorData: string,
    clientJSONData: ClientDataJSONComponents,
    newP256Key: P256PublicKeyComponents,
    p256Signature: P256SignatureComponents,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  >;

  addEVMAddressWithP256Key(
    keyId: WebauthnCredentialId,
    authenticatorData: string,
    clientJSONData: ClientDataJSONComponents,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    p256Signature: P256SignatureComponents,
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

  generateXWithP256challenge(): Result<string, InvalidParametersError>;
}

export const ISnickerdoodleWalletFactoryType = Symbol.for(
  "ISnickerdoodleWalletFactory",
);
