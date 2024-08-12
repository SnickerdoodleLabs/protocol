import {
  EVMContractAddress,
  BlockchainCommonErrors,
  SmartWalletContractError,
  EVMAccountAddress,
  TokenAmount,
  TokenId,
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
   * Returns the list of supported chain layer zero endpoint ids
   */
  getSupportedChainEIDs(): ResultAsync<
    LayerZeroEndpointId[],
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
   * Returns the computed smart wallet address given a name
   */
  computeSmartWalletAddress(
    name: string,
  ): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the native token amount in wei, of the cost to attach to the deploy function for layer zero
   */
  quote(
    layerZeroEndpointId: LayerZeroEndpointId,
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
   * Returns the owner of the deployed smart wallet
   */
  getDeployedSmartWalletAddressToOwner(
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the flag that tracks if an owner has deployed the specific smart wallet address
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
