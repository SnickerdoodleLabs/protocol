import {
  RewardsFactoryError,
  BaseURI,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
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
  ): ResultAsync<
    ethers.BigNumber,
    RewardsFactoryError | BlockchainCommonErrors
  >;
}

export const IRewardsContractFactoryType = Symbol.for(
  "IRewardsContractFactory",
);
