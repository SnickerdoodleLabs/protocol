import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EVMAccountAddress,
  TokenAmount,
  SnickerdoodleWalletFactoryContractError,
  LayerZeroEndpointId,
  InvalidParametersError,
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  OperatorAndPoint,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISnickerdoodleWalletFactoryContract extends IBaseContract {
  beaconAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Sets the peer contract address on the destination chain's smart wallet factory address
   */
  setPeer(
    layerZeroEndpointId: LayerZeroEndpointId,
    SnickerdoodleWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  >;

  /**
   * Returns the contract address of a peer EID registered on the contract
   */
  peers(
    destinationChainEid: LayerZeroEndpointId,
  ): ResultAsync<
    EVMContractAddress,
    | SnickerdoodleWalletFactoryContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  >;

  /**
   * Returns the computed smart wallet proxy address given a name
   */
  computeSnickerdoodleWalletProxyAddress(
    name: string,
  ): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the native token amount in wei, of the cost to attach to the deploy function for layer zero
   */
  quoteClaimSnickerdoodleWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    operator: EVMAccountAddress | EVMContractAddress,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    smartWalletAddress: EVMContractAddress,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Deploys the smart wallet
   */
  deploySnickerdoodleWalletUpgradeableBeacon(
    name: string,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  >;

  /**
   * Sends a Layer Zero message to claim/lock the smart wallet address on the destination chain a given owner
   * Owner must have deployed the smart wallet on the source chain first
   */
  claimSnickerdoodleWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    gas: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  >;

  /**
   * Returns the operator and point of the deployed smart wallet
   */
  getSnickerdoodleWalletToOperatorOwnerPoint(
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    OperatorAndPoint,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  >;
}

export const ISnickerdoodleWalletFactoryContractType = Symbol.for(
  "ISnickerdoodleWalletFactoryContract",
);
