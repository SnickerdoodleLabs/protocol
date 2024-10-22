import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EVMAccountAddress,
  PasskeyId,
  P256PublicKeyComponent,
  P256SignatureComponent,
  OperatorGatewayContractError,
  LayerZeroEndpointId,
  OperatorDomain,
  TokenAmount,
  SnickerdoodleWalletUsername,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  AuthenticatorData,
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IOperatorGatewayContract extends IBaseContract {
  deployWallets(
    usernames: SnickerdoodleWalletUsername[],
    p256Keys: P256PublicKeyComponent[][],
    evmAccounts: EVMContractAddress[][] | EVMAccountAddress[][],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    OperatorGatewayContractError | BlockchainCommonErrors
  >;

  reserveWalletsOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    usernames: SnickerdoodleWalletUsername[],
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

  /**
   * Authorizes an operator gateway on the destination chain
   * Sends a Layer Zero message to authorize the operator gateway on the destination chain
   * nativeTokenFee - The amount of native token to be paid to send the message to the destination chain
   * gas - The gas required to execute the _lzReceive() function on the destination chain
   */
  authorizeWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    username: SnickerdoodleWalletUsername,
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quoteAuthorizeWalletOnDestinationChain function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;

  addP256KeysWithP256Keys(
    evmAccounts: EVMContractAddress[] | EVMAccountAddress[],
    keyIds: PasskeyId[],
    authenticatorDatas: AuthenticatorData[],
    newP256Keys: P256PublicKeyComponent[],
    p256Signatures: P256SignatureComponent[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  >;
}

export const IOperatorGatewayContract = Symbol.for("IOperatorGatewayContract");
