import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EVMAccountAddress,
  TokenAmount,
  SmartWalletFactoryContractError,
  LayerZeroEndpointId,
  LayerZeroOptions,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface ISmartWalletFactoryContract extends IBaseContract {
  beaconAddress(): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Sets the peer contract address on the destination chain's smart wallet factory address
   */
  setPeer(
    layerZeroEndpointId: LayerZeroEndpointId,
    smartWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  >;

  /**
   * Returns the contract address of a peer EID registered on the contract
   */
  peers(
    destinationChainEid: LayerZeroEndpointId,
  ): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the computed smart wallet proxy address given a name
   */
  computeSmartWalletProxyAddress(
    name: string,
  ): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the native token amount in wei, of the cost to attach to the deploy function for layer zero
   */
  quoteClaimSmartWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    owner: EVMAccountAddress,
    smartWalletAddress: EVMContractAddress,
    layerZeroOptions: string,
  ): ResultAsync<
    TokenAmount,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Deploys the smart wallet
   */
  deploySmartWalletUpgradeableBeacon(
    layerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    owner: EVMAccountAddress,
    layerZeroOptions: LayerZeroOptions,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  >;

  /**
   * Sends a Layer Zero message to claim/lock the smart wallet address on the destination chain a given owner
   * Owner must have deployed the smart wallet on the source chain first
   */
  claimSmartWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    owner: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  >;

  /**
   * Returns the owner of the deployed smart wallet
   */
  getDeployedSmartWalletAddressToOwner(
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the flag that tracks if an owner has deployed the specific smart wallet address on the given chain
   */
  getOwnerToDeployedSmartWalletAddressFlag(
    owner: EVMAccountAddress,
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;
}

export const ISmartWalletFactoryContractType = Symbol.for(
  "ISmartWalletFactoryContract",
);