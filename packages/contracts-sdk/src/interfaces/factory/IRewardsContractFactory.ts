import {
  RewardsFactoryError,
  BaseURI,
  BlockchainCommonErrors,
  TokenUri,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IRewardsContractFactory {
  deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    overrides?: ContractOverrides,
    omitGasFee?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployERC721Contract(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<bigint, RewardsFactoryError | BlockchainCommonErrors>;

  deployERC20Reward(
    name: string,
    symbol: string,
    overrides?: ContractOverrides,
    omitGasFee?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployERC20Contract(
    name: string,
    symbol: string,
  ): ResultAsync<bigint, RewardsFactoryError | BlockchainCommonErrors>;

  deployERC1155Reward(
    numberOfRewards: number,
    tokenURIs: TokenUri[],
    overrides: ContractOverrides,
    omitGasFee?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployERC1155Contract(
    numberOfRewards: number,
    tokenURIs: TokenUri[],
  ): ResultAsync<bigint, RewardsFactoryError | BlockchainCommonErrors>;

  deployOFT20Reward(
    name: string,
    symbol: string,
    layerZeroEndpoint: EVMContractAddress,
    overrides: ContractOverrides,
    omitGasFee?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployOFT20RewardContract(
    name: string,
    symbol: string,
    layerZeroEndpoint: EVMContractAddress,
  ): ResultAsync<bigint, RewardsFactoryError | BlockchainCommonErrors>;

  deployONFT721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    minGasToTransfer: bigint,
    layerZeroEndpoint: EVMContractAddress,
    overrides: ContractOverrides,
    omitGasFee?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployONFT721RewardContract(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    minGasToTransfer: bigint,
    layerZeroEndpoint: EVMContractAddress,
  ): ResultAsync<bigint, RewardsFactoryError | BlockchainCommonErrors>;
}

export const IRewardsContractFactoryType = Symbol.for(
  "IRewardsContractFactory",
);
