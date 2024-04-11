import {
  EVMContractAddress,
  BigNumberString,
  BlockchainCommonErrors,
  MarketplaceTag,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { Tag } from "@contracts-sdk/interfaces/objects";

export interface IContentFactoryContract<T> extends IBaseContract {
  getGovernanceToken(): ResultAsync<
    EVMContractAddress,
    T | BlockchainCommonErrors
  >;

  isStakingToken(
    stakingToken: EVMContractAddress,
  ): ResultAsync<boolean, T | BlockchainCommonErrors>;

  listingDuration(): ResultAsync<number, T | BlockchainCommonErrors>;

  maxTagsPerListing(): ResultAsync<number, T | BlockchainCommonErrors>;

  getTagTotal(
    tag: MarketplaceTag,
    stakedToken: EVMContractAddress,
  ): ResultAsync<number, T | BlockchainCommonErrors>;

  getListingsForward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<MarketplaceListing[], T | BlockchainCommonErrors>;

  getListingsBackward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<MarketplaceListing[], T | BlockchainCommonErrors>;
}

export const IContentFactoryContractType = Symbol.for(
  "IContentFactoryContract",
);
