import {
  EVMContractAddress,
  BigNumberString,
  BlockchainCommonErrors,
  MarketplaceTag,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { Block } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  Tag,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

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

  computeFee(
    slot: BigNumberString,
  ): ResultAsync<BigNumberString, T | BlockchainCommonErrors>;

  // External function meant to be called by anyone to boot an expired listing
  removeExpiredListings(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    slots: BigNumberString[],
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, T | BlockchainCommonErrors>;
}

export interface IInternalContentFactoryContract<T> extends IBaseContract {
  // Functions below are only callable by a content object contract
  // Calling them in another way will result in an error
  // Adding them as part of this interface for documentation purposes
  //    aka These functions exist on the contract and we've chosen not to expose them
  // In the future we can consider moving them into the main interface

  // Called by Consent(newGlobalTag) > ContentObject(_newGlobalTag) > ContentFactory(initializeTag)
  initializeTag(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    newHead: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  // Called by Consent(newLocalTagUpstream) > ContentObject(_newLocalTagUpstream) > ContentFactory(insertUpstream)
  insertUpstream(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  // Called by Consent(moveExistingListingUpstream) > ContentObject(_moveExistingListingUpstream) > ContentFactory(moveUpstream)
  moveUpstream(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    newSlot: BigNumberString,
    downstreamSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  // Called by Consent(newLocalTagDownstream) > ContentObject(_newLocalTagDownstream) > ContentFactory(insertDownstream)
  insertDownstream(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    existingSlot: BigNumberString,
    newSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  // Called by Consent(replaceExpiredListing) > ContentObject(_replaceExpiredListing) > ContentFactory(replaceExpiredListing)
  replaceExpiredListing(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    slot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  // Called by Consent(removeListing) > ContentObject(_removeListing) > ContentFactory(removeListing)
  removeListing(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removedSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;
}

export const IContentFactoryContractType = Symbol.for(
  "IContentFactoryContract",
);
