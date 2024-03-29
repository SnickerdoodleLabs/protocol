import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ContractOverrides,
  EConsentRoles,
  IConsentContract,
  IConsentContractFilters,
  Tag,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  EVMContractAddress,
  TokenId,
  HexString32,
  ConsentContractError,
  HexString,
  Signature,
  IpfsCID,
  EVMAccountAddress,
  TokenUri,
  BlockNumber,
  ConsentToken,
  DomainName,
  RequestForData,
  BaseURI,
  InvalidParametersError,
  BigNumberString,
  BlockchainCommonErrors,
  Commitment,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class ConsentContractWrapper
  extends BaseContractWrapper<IConsentContract>
  implements IConsentContract
{
  public constructor(
    primary: IConsentContract,
    secondary: IConsentContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }
  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public optIn(
    commitment: Commitment,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.optIn(commitment, contractOverrides),
      () => this.secondary?.optIn(commitment, contractOverrides),
    );
  }

  public restrictedOptIn(
    commitment: Commitment,
    nonce: TokenId,
    signature: Signature,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () =>
        this.primary.restrictedOptIn(
          commitment,
          nonce,
          signature,
          contractOverrides,
        ),
      () =>
        this.secondary?.restrictedOptIn(
          commitment,
          nonce,
          signature,
          contractOverrides,
        ),
    );
  }

  public requestForData(
    ipfsCID: IpfsCID,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.requestForData(ipfsCID),
      () => this.secondary?.requestForData(ipfsCID),
    );
  }

  public getConsentOwner(): ResultAsync<
    EVMAccountAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getConsentOwner(),
      () => this.secondary?.getConsentOwner(),
    );
  }

  public checkCommitments(
    commitments: Commitment[],
  ): ResultAsync<number[], ConsentContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.checkCommitments(commitments),
      () => this.secondary?.checkCommitments(commitments),
    );
  }
  public checkNonces(
    nonces: TokenId[],
  ): ResultAsync<boolean[], ConsentContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.checkNonces(nonces),
      () => this.secondary?.checkNonces(nonces),
    );
  }
  public fetchAnonymitySet(
    start: BigNumberString,
    stop: BigNumberString,
  ): ResultAsync<Commitment[], ConsentContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.fetchAnonymitySet(start, stop),
      () => this.secondary?.fetchAnonymitySet(start, stop),
    );
  }
  public getStakingToken(): ResultAsync<
    EVMContractAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getStakingToken(),
      () => this.secondary?.getStakingToken(),
    );
  }
  public tagIndices(
    tag: string,
  ): ResultAsync<
    BigNumberString,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.tagIndices(tag),
      () => this.secondary?.tagIndices(tag),
    );
  }
  public updateMaxTagsLimit(
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<
    WrappedTransactionResponse,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.updateMaxTagsLimit(overrides),
      () => this.secondary?.updateMaxTagsLimit(overrides),
    );
  }
  public restakeExpiredListing(
    tag: string,
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.restakeExpiredListing(tag, stakingToken, overrides),
      () => this.secondary?.restakeExpiredListing(tag, stakingToken, overrides),
    );
  }

  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getDefaultAdminRoleMembers(),
      () => this.secondary?.getDefaultAdminRoleMembers(),
    );
  }

  public getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getSignerRoleMembers(),
      () => this.secondary?.getSignerRoleMembers(),
    );
  }

  public getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getPauserRoleMembers(),
      () => this.secondary?.getPauserRoleMembers(),
    );
  }

  public getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getRequesterRoleMembers(),
      () => this.secondary?.getRequesterRoleMembers(),
    );
  }

  public queryFilter(
    eventFilter: ethers.ContractEventName,
    fromBlock?: BlockNumber | undefined,
    toBlock?: BlockNumber | undefined,
  ): ResultAsync<
    (ethers.EventLog | ethers.Log)[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.queryFilter(eventFilter, fromBlock, toBlock),
      () => this.secondary?.queryFilter(eventFilter, fromBlock, toBlock),
    );
  }

  public addDomain(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.addDomain(domain),
      () => this.secondary?.addDomain(domain),
    );
  }

  public removeDomain(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.removeDomain(domain),
      () => this.secondary?.removeDomain(domain),
    );
  }

  public checkDomain(
    domain: DomainName,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.checkDomain(domain),
      () => this.secondary?.checkDomain(domain),
    );
  }

  public getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber | undefined,
    toBlock?: BlockNumber | undefined,
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () =>
        this.primary.getRequestForDataListByRequesterAddress(
          requesterAddress,
          fromBlock,
          toBlock,
        ),
      () =>
        this.secondary?.getRequestForDataListByRequesterAddress(
          requesterAddress,
          fromBlock,
          toBlock,
        ),
    );
  }

  public getRequestForDataList(
    fromBlock?: BlockNumber | undefined,
    toBlock?: BlockNumber | undefined,
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getRequestForDataList(fromBlock, toBlock),
      () => this.secondary?.getRequestForDataList(fromBlock, toBlock),
    );
  }

  public disableOpenOptIn(): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.disableOpenOptIn(),
      () => this.secondary?.disableOpenOptIn(),
    );
  }

  public enableOpenOptIn(): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.enableOpenOptIn(),
      () => this.secondary?.enableOpenOptIn(),
    );
  }

  public baseURI(): ResultAsync<
    BaseURI,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.baseURI(),
      () => this.secondary?.baseURI(),
    );
  }

  public setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.setBaseURI(baseUri),
      () => this.secondary?.setBaseURI(baseUri),
    );
  }

  public hasRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.hasRole(role, address),
      () => this.secondary?.hasRole(role, address),
    );
  }

  public grantRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.grantRole(role, address),
      () => this.secondary?.grantRole(role, address),
    );
  }

  public revokeRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.revokeRole(role, address),
      () => this.secondary?.revokeRole(role, address),
    );
  }

  public renounceRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.renounceRole(role, address),
      () => this.secondary?.renounceRole(role, address),
    );
  }

  public getQueryHorizon(): ResultAsync<
    BlockNumber,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getQueryHorizon(),
      () => this.secondary?.getQueryHorizon(),
    );
  }

  public setQueryHorizon(
    blockNumber: BlockNumber,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.setQueryHorizon(blockNumber),
      () => this.secondary?.setQueryHorizon(blockNumber),
    );
  }

  public estimateGasLimitForSetQueryHorizon(
    blockNumber: BlockNumber,
  ): ResultAsync<
    BigNumberString,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.estimateGasLimitForSetQueryHorizon(blockNumber),
      () => this.secondary?.estimateGasLimitForSetQueryHorizon(blockNumber),
    );
  }

  public totalSupply(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.totalSupply(),
      () => this.secondary?.totalSupply(),
    );
  }

  public openOptInDisabled(): ResultAsync<
    boolean,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.openOptInDisabled(),
      () => this.secondary?.openOptInDisabled(),
    );
  }

  public getSignature(
    values: (
      | string
      | EVMContractAddress
      | EVMAccountAddress
      | HexString
      | bigint
    )[],
  ): ResultAsync<Signature, InvalidParametersError> {
    return this.fallback(
      () => this.primary.getSignature(values),
      () => this.secondary?.getSignature(values),
    );
  }

  public filters: IConsentContractFilters = this.primary.filters;

  public getNumberOfStakedTags(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getNumberOfStakedTags(),
      () => this.secondary?.getNumberOfStakedTags(),
    );
  }

  public getTagArray(): ResultAsync<
    Tag[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getTagArray(),
      () => this.secondary?.getTagArray(),
    );
  }

  public newGlobalTag(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeOWner: any,
    newStakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () =>
        this.primary.newGlobalTag(
          tag,
          stakingToken,
          stakeOWner,
          newStakeAmount,
          overrides,
        ),
      () =>
        this.secondary?.newGlobalTag(
          tag,
          stakingToken,
          stakeOWner,
          newStakeAmount,
          overrides,
        ),
    );
  }

  public newLocalTagUpstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeOwner: any,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () =>
        this.primary.newLocalTagUpstream(
          tag,
          stakingToken,
          stakeOwner,
          newSlot,
          existingSlot,
          overrides,
        ),
      () =>
        this.secondary?.newLocalTagUpstream(
          tag,
          stakingToken,
          stakeOwner,
          newSlot,
          existingSlot,
          overrides,
        ),
    );
  }

  public newLocalTagDownstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeOwner: any,
    existingStakeAmount: BigNumberString,
    newStakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () =>
        this.primary.newLocalTagDownstream(
          tag,
          stakingToken,
          stakeOwner,
          existingStakeAmount,
          newStakeAmount,
          overrides,
        ),
      () =>
        this.secondary?.newLocalTagDownstream(
          tag,
          stakingToken,
          stakeOwner,
          existingStakeAmount,
          newStakeAmount,
          overrides,
        ),
    );
  }

  public replaceExpiredListing(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeOwner: any,
    slot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () =>
        this.primary.replaceExpiredListing(
          tag,
          stakingToken,
          stakeOwner,
          slot,
          overrides,
        ),
      () =>
        this.secondary?.replaceExpiredListing(
          tag,
          stakingToken,
          stakeOwner,
          slot,
          overrides,
        ),
    );
  }

  public moveExistingListingUpstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeOwner: any,
    newStakeAmount: BigNumberString,
    existingStakeAmount: BigNumberString,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, any> {
    return this.fallback(
      () =>
        this.primary.moveExistingListingUpstream(
          tag,
          stakingToken,
          stakeOwner,
          newStakeAmount,
          existingStakeAmount,
          overrides,
        ),
      () =>
        this.secondary?.moveExistingListingUpstream(
          tag,
          stakingToken,
          stakeOwner,
          newStakeAmount,
          existingStakeAmount,
          overrides,
        ),
    );
  }

  public removeListing(
    tag: string,
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.fallback(
      () => this.primary.removeListing(tag, stakingToken, overrides),
      () => this.secondary?.removeListing(tag, stakingToken, overrides),
    );
  }
}
