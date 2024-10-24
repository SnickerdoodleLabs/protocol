import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EVMAccountAddress,
  TokenAmount,
  SnickerdoodleFactoryContractError,
  LayerZeroEndpointId,
  InvalidParametersError,
  P256PublicKeyComponent,
  OperatorDomain,
  SnickerdoodleWalletUsername,
} from "@snickerdoodlelabs/objects";
import { BytesLike } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISnickerdoodleFactoryContract extends IBaseContract {
  /**
   * Sets the peer contract address on the destination chain's smart wallet factory address
   */
  setPeer(
    layerZeroEndpointId: LayerZeroEndpointId,
    SnickerdoodleWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  >;

  /**
   * Returns the contract address of a peer EID registered on the contract
   */
  peers(
    destinationChainEid: LayerZeroEndpointId,
  ): ResultAsync<
    EVMContractAddress,
    | SnickerdoodleFactoryContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  >;

  /**
   * Returns the wallet beacon address
   */
  walletBeaconAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the operator gateway beacon address
   */
  operatorGatewayBeacon(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Deploys multiple wallet proxies
   */
  deployWalletProxies(
    usernames: SnickerdoodleWalletUsername[],
    p256Keys: P256PublicKeyComponent[][],
    evmAccounts: EVMContractAddress[][] | EVMAccountAddress[][],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  >;

  /**
   * Deploys single wallet proxies
   */
  deployWalletProxy(
    username: SnickerdoodleWalletUsername,
    p256Keys: P256PublicKeyComponent[],
    evmAccounts: EVMContractAddress[] | EVMAccountAddress[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  >;

  /**
   * Update the wallet hash of the Snickerdoodle wallet
   */
  updateWalletHash(
    newWalletHash: BytesLike,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  >;

  /**
   * Deploys a new operator gateway proxy
   */
  deployOperatorGatewayProxy(
    domain: OperatorDomain,
    operatorAccounts: EVMAccountAddress[] | EVMContractAddress[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  >;

  /**
   * Authorizes an operator gateway on the destination chain
   * Sends a Layer Zero message to authorize the operator gateway on the destination chain
   * nativeTokenFee - The amount of native token to be paid to send the message to the destination chain
   * gas - The gas required to execute the _lzReceive() function on the destination chain
   */
  authorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    domain: OperatorDomain,
    gas: bigint,
    nativeTokenFee: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
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
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the calculate the proxy address
   * salt - for user wallets, is its username plus domain name
   * salt - for operator gateways, it is the domain name
   * beaconAddress - The respective wallet or operator gateway beacon address
   */
  computeProxyAddress(
    salt: string, // The salt used to create the proxy address
    beaconAddress: EVMContractAddress,
  ): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  >;
}

export const ISnickerdoodleWalletFactoryContractType = Symbol.for(
  "ISnickerdoodleWalletFactoryContract",
);
