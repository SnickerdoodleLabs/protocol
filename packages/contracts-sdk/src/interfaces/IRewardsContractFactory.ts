import {
  RewardsFactoryError,
  BaseURI,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";

export interface IRewardsContractFactory {
  deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<EVMContractAddress, RewardsFactoryError>;

  estimateGasToDeployERC721Contract(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<ethers.BigNumber, RewardsFactoryError>;
}

export const IRewardsContractFactoryType = Symbol.for(
  "IRewardsContractFactory",
);
