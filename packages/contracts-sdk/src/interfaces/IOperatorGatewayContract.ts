import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EVMAccountAddress,
  PasskeyId,
  P256PublicKeyComponents,
  P256SignatureComponents,
  OperatorGatewayContractError,
  LayerZeroEndpointId,
  OperatorDomain,
  TokenAmount,
  SnickerdoodleWalletUsername,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  P256VerificationData,
  ContractOverrides,
  WrappedTransactionResponse,
  EOperatorGatewayRoles,
} from "@contracts-sdk/interfaces/index.js";

export interface IOperatorGatewayContract extends IBaseContract {
  deployWallets(
    usernames: SnickerdoodleWalletUsername[],
    p256Keys: P256PublicKeyComponents[][],
    evmAccounts: EVMContractAddress[][] | EVMAccountAddress[][],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  authorizeWalletsOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    usernames: SnickerdoodleWalletUsername[],
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quote function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  quoteAuthorizeWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    username: string,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  authorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quote function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  /**
   * Returns the estimated fees in native token to send the Layer Zero message to the destination chain
   * gas - The gas required to execute the _lzReceive() function on the destination chain
   */
  quoteAuthorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    domain: OperatorDomain,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  addP256KeysWithP256Keys(
    evmAccounts: EVMContractAddress[] | EVMAccountAddress[],
    keyIds: PasskeyId[],
    p256VerificationDatas: P256VerificationData[],
    newP256Keys: P256PublicKeyComponents[],
    p256Signatures: P256SignatureComponents[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  grantRole(
    role: EOperatorGatewayRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  revokeRole(
    role: EOperatorGatewayRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  renounceRole(
    role: EOperatorGatewayRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  hasRole(
    role: EOperatorGatewayRoles,
    address: EVMAccountAddress,
  ): ResultAsync<
    boolean,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  factoryAddress(): ResultAsync<
    EVMContractAddress,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  computeWalletAddresses(
    userNames: string[],
  ): ResultAsync<
    EVMContractAddress[],
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  domainName(): ResultAsync<
    string,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;
}

export const IOperatorGatewayContract = Symbol.for("IOperatorGatewayContract");
