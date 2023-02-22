import {
  RewardsFactoryError,
  BaseURI,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRewardsContractFactory {
  deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<EVMContractAddress, RewardsFactoryError>;
}

export const IRewardsContractFactoryType = Symbol.for(
  "IRewardsContractFactory",
);
