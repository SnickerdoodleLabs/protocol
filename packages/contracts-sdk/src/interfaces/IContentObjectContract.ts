import {
  EVMContractAddress,
  BigNumberString,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { Tag } from "@contracts-sdk/interfaces/objects";

export interface IContentObjectContract<T> extends IBaseContract {
  tagIndices(
    tag: string,
    stakingToken: EVMContractAddress,
  ): ResultAsync<BigNumberString, T | BlockchainCommonErrors>;

  getNumberOfStakedTags(
    stakingToken: EVMContractAddress,
  ): ResultAsync<number, T | BlockchainCommonErrors>;

  getTagArray(
    stakingToken: EVMContractAddress,
  ): ResultAsync<Tag[], T | BlockchainCommonErrors>;

  getContentAddress(): ResultAsync<
    EVMContractAddress,
    T | BlockchainCommonErrors
  >;
}

export const IContentObjectContractType = Symbol.for("IContentObjectContract");
