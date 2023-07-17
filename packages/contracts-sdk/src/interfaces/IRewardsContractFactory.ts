import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import {
  RewardsFactoryError,
  BaseURI,
  TBlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IRewardsContractFactory {
  deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | RewardsFactoryError
  >;

  estimateGasToDeployERC721Contract(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<
    ethers.BigNumber,
    RewardsFactoryError | TBlockchainCommonErrors
  >;
}

export const IRewardsContractFactoryType = Symbol.for(
  "IRewardsContractFactory",
);
