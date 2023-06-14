import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ContractOverrides,
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
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event, BigNumber } from "ethers";
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
    tokenId: TokenId,
    agreementFlags: HexString32,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.optIn(tokenId, agreementFlags, contractOverrides),
      () => this.secondary?.optIn(tokenId, agreementFlags, contractOverrides),
    );
  }

  public encodeOptIn(tokenId: TokenId, agreementFlags: HexString32): HexString {
    return this.primary.encodeOptIn(tokenId, agreementFlags);
  }

  public restrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () =>
        this.primary.restrictedOptIn(
          tokenId,
          agreementFlags,
          signature,
          contractOverrides,
        ),
      () =>
        this.secondary?.restrictedOptIn(
          tokenId,
          agreementFlags,
          signature,
          contractOverrides,
        ),
    );
  }
  public encodeRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString {
    return this.primary.encodeRestrictedOptIn(
      tokenId,
      signature,
      agreementFlags,
    );
  }
  public anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () =>
        this.primary.anonymousRestrictedOptIn(
          tokenId,
          agreementFlags,
          signature,
          contractOverrides,
        ),
      () =>
        this.secondary?.anonymousRestrictedOptIn(
          tokenId,
          agreementFlags,
          signature,
          contractOverrides,
        ),
    );
  }
  public encodeAnonymousRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString {
    return this.primary.encodeAnonymousRestrictedOptIn(
      tokenId,
      signature,
      agreementFlags,
    );
  }

  public optOut(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.optOut(tokenId, contractOverrides),
      () => this.secondary?.optOut(tokenId, contractOverrides),
    );
  }

  public encodeOptOut(tokenId: TokenId): HexString {
    return this.primary.encodeOptOut(tokenId);
  }

  public agreementFlags(
    tokenId: TokenId,
  ): ResultAsync<HexString32, ConsentContractError> {
    return this.fallback(
      () => this.primary.agreementFlags(tokenId),
      () => this.secondary?.agreementFlags(tokenId),
    );
  }

  public getMaxCapacity(): ResultAsync<number, ConsentContractError> {
    return this.fallback(
      () => this.primary.getMaxCapacity(),
      () => this.secondary?.getMaxCapacity(),
    );
  }

  public updateMaxCapacity(
    maxCapacity: number,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.updateMaxCapacity(maxCapacity),
      () => this.secondary?.updateMaxCapacity(maxCapacity),
    );
  }

  public updateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.updateAgreementFlags(tokenId, newAgreementFlags),
      () => this.secondary?.updateAgreementFlags(tokenId, newAgreementFlags),
    );
  }

  public encodeUpdateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
  ): HexString {
    return this.primary.encodeUpdateAgreementFlags(tokenId, newAgreementFlags);
  }

  public requestForData(
    ipfsCID: IpfsCID,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.requestForData(ipfsCID),
      () => this.secondary?.requestForData(ipfsCID),
    );
  }

  public getConsentOwner(): ResultAsync<
    EVMAccountAddress,
    ConsentContractError
  > {
    return this.fallback(
      () => this.primary.getConsentOwner(),
      () => this.secondary?.getConsentOwner(),
    );
  }

  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return this.fallback(
      () => this.primary.getDefaultAdminRoleMembers(),
      () => this.secondary?.getDefaultAdminRoleMembers(),
    );
  }

  public getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return this.fallback(
      () => this.primary.getSignerRoleMembers(),
      () => this.secondary?.getSignerRoleMembers(),
    );
  }

  public getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return this.fallback(
      () => this.primary.getPauserRoleMembers(),
      () => this.secondary?.getPauserRoleMembers(),
    );
  }

  public getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return this.fallback(
      () => this.primary.getRequesterRoleMembers(),
      () => this.secondary?.getRequesterRoleMembers(),
    );
  }

  public balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError> {
    return this.fallback(
      () => this.primary.balanceOf(address),
      () => this.secondary?.balanceOf(address),
    );
  }

  public ownerOf(
    tokenId: TokenId,
  ): ResultAsync<EVMAccountAddress, ConsentContractError> {
    return this.fallback(
      () => this.primary.ownerOf(tokenId),
      () => this.secondary?.ownerOf(tokenId),
    );
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, ConsentContractError> {
    return this.fallback(
      () => this.primary.tokenURI(tokenId),
      () => this.secondary?.tokenURI(tokenId),
    );
  }

  public queryFilter(
    eventFilter: EventFilter,
    fromBlock?: BlockNumber | undefined,
    toBlock?: BlockNumber | undefined,
  ): ResultAsync<Event[], ConsentContractError> {
    return this.fallback(
      () => this.primary.queryFilter(eventFilter, fromBlock, toBlock),
      () => this.secondary?.queryFilter(eventFilter, fromBlock, toBlock),
    );
  }

  public getConsentToken(
    tokenId: TokenId,
  ): ResultAsync<ConsentToken, ConsentContractError> {
    return this.fallback(
      () => this.primary.getConsentToken(tokenId),
      () => this.secondary?.getConsentToken(tokenId),
    );
  }

  public addDomain(domain: string): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.addDomain(domain),
      () => this.secondary?.addDomain(domain),
    );
  }

  public removeDomain(domain: string): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.removeDomain(domain),
      () => this.secondary?.removeDomain(domain),
    );
  }

  public getDomains(): ResultAsync<DomainName[], ConsentContractError> {
    return this.fallback(
      () => this.primary.getDomains(),
      () => this.secondary?.getDomains(),
    );
  }

  public getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber | undefined,
    toBlock?: BlockNumber | undefined,
  ): ResultAsync<RequestForData[], ConsentContractError> {
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

  public getLatestTokenIdByOptInAddress(
    optInAddress: EVMAccountAddress,
  ): ResultAsync<TokenId | null, ConsentContractError> {
    return this.fallback(
      () => this.primary.getLatestTokenIdByOptInAddress(optInAddress),
      () => this.secondary?.getLatestTokenIdByOptInAddress(optInAddress),
    );
  }

  public disableOpenOptIn(): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.disableOpenOptIn(),
      () => this.secondary?.disableOpenOptIn(),
    );
  }

  public enableOpenOptIn(): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.enableOpenOptIn(),
      () => this.secondary?.enableOpenOptIn(),
    );
  }

  public baseURI(): ResultAsync<BaseURI, ConsentContractError> {
    return this.fallback(
      () => this.primary.baseURI(),
      () => this.secondary?.baseURI(),
    );
  }

  public setBaseURI(baseUri: BaseURI): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.setBaseURI(baseUri),
      () => this.secondary?.setBaseURI(baseUri),
    );
  }

  public hasRole(
    role:
      | "DEFAULT_ADMIN_ROLE"
      | "PAUSER_ROLE"
      | "REQUESTER_ROLE"
      | "SIGNER_ROLE",
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError> {
    return this.fallback(
      () => this.primary.hasRole(role, address),
      () => this.secondary?.hasRole(role, address),
    );
  }

  public grantRole(
    role:
      | "DEFAULT_ADMIN_ROLE"
      | "PAUSER_ROLE"
      | "REQUESTER_ROLE"
      | "SIGNER_ROLE",
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.grantRole(role, address),
      () => this.secondary?.grantRole(role, address),
    );
  }

  public revokeRole(
    role:
      | "DEFAULT_ADMIN_ROLE"
      | "PAUSER_ROLE"
      | "REQUESTER_ROLE"
      | "SIGNER_ROLE",
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.revokeRole(role, address),
      () => this.secondary?.revokeRole(role, address),
    );
  }

  public renounceRole(
    role:
      | "DEFAULT_ADMIN_ROLE"
      | "PAUSER_ROLE"
      | "REQUESTER_ROLE"
      | "SIGNER_ROLE",
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.renounceRole(role, address),
      () => this.secondary?.renounceRole(role, address),
    );
  }

  public getQueryHorizon(): ResultAsync<BlockNumber, ConsentContractError> {
    return this.fallback(
      () => this.primary.getQueryHorizon(),
      () => this.secondary?.getQueryHorizon(),
    );
  }

  public setQueryHorizon(
    blockNumber: BlockNumber,
  ): ResultAsync<void, ConsentContractError> {
    return this.fallback(
      () => this.primary.setQueryHorizon(blockNumber),
      () => this.secondary?.setQueryHorizon(blockNumber),
    );
  }

  public totalSupply(): ResultAsync<number, ConsentContractError> {
    return this.fallback(
      () => this.primary.totalSupply(),
      () => this.secondary?.totalSupply(),
    );
  }

  public openOptInDisabled(): ResultAsync<boolean, ConsentContractError> {
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
      | BigNumber
    )[],
  ): ResultAsync<Signature, InvalidParametersError> {
    return this.fallback(
      () => this.primary.getSignature(values),
      () => this.secondary?.getSignature(values),
    );
  }

  public filters: IConsentContractFilters = this.primary.filters;

  public getMaxTags(): ResultAsync<number, ConsentContractError> {
    return this.fallback(
      () => this.primary.getMaxTags(),
      () => this.secondary?.getMaxTags(),
    );
  }

  public getNumberOfStakedTags(): ResultAsync<number, ConsentContractError> {
    return this.fallback(
      () => this.primary.getNumberOfStakedTags(),
      () => this.secondary?.getNumberOfStakedTags(),
    );
  }

  public getTagArray(): ResultAsync<Tag[], ConsentContractError> {
    return this.fallback(
      () => this.primary.getTagArray(),
      () => this.secondary?.getTagArray(),
    );
  }

  public newGlobalTag(
    tag: string,
    newSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.fallback(
      () => this.primary.newGlobalTag(tag, newSlot),
      () => this.secondary?.newGlobalTag(tag, newSlot),
    );
  }

  public newLocalTagUpstream(
    tag: string,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.fallback(
      () => this.primary.newLocalTagUpstream(tag, newSlot, existingSlot),
      () => this.secondary?.newLocalTagUpstream(tag, newSlot, existingSlot),
    );
  }

  public newLocalTagDownstream(
    tag: string,
    existingSlot: BigNumberString,
    newSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.fallback(
      () => this.primary.newLocalTagDownstream(tag, newSlot, existingSlot),
      () => this.secondary?.newLocalTagDownstream(tag, newSlot, existingSlot),
    );
  }

  public replaceExpiredListing(
    tag: string,
    slot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.fallback(
      () => this.primary.replaceExpiredListing(tag, slot),
      () => this.secondary?.replaceExpiredListing(tag, slot),
    );
  }

  public removeListing(
    tag: string,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.fallback(
      () => this.primary.removeListing(tag),
      () => this.secondary?.removeListing(tag),
    );
  }
}
