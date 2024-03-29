import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ContractOverrides,
  IConsentFactoryContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  EVMContractAddress,
  EVMAccountAddress,
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  MarketplaceListing,
  MarketplaceTag,
  TransactionResponseError,
  BlockchainCommonErrors,
  IpfsCID,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class ConsentFactoryContractWrapper
  extends BaseContractWrapper<IConsentFactoryContract>
  implements IConsentFactoryContract
{
  public constructor(
    primary: IConsentFactoryContract,
    secondary: IConsentFactoryContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }
  public getGovernanceToken(): ResultAsync<EVMContractAddress, any> {
    return this.fallback(
      () => this.primary.getGovernanceToken(),
      () => this.secondary?.getGovernanceToken(),
    );
  }
  public isStakingToken(
    stakingToken: EVMContractAddress,
  ): ResultAsync<boolean, any> {
    return this.fallback(
      () => this.primary.isStakingToken(stakingToken),
      () => this.secondary?.isStakingToken(stakingToken),
    );
  }
  public registerStakingToken(
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, any> {
    return this.fallback(
      () => this.primary.registerStakingToken(stakingToken, overrides),
      () => this.secondary?.registerStakingToken(stakingToken, overrides),
    );
  }

  public adminRemoveListings(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removedSlot: BigNumberString[],
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, any> {
    return this.fallback(
      () =>
        this.primary.adminRemoveListings(
          tag,
          stakingToken,
          removedSlot,
          overrides,
        ),
      () =>
        this.secondary?.adminRemoveListings(
          tag,
          stakingToken,
          removedSlot,
          overrides,
        ),
    );
  }

  public blockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, any> {
    return this.fallback(
      () =>
        this.primary.blockContentObject(
          stakingToken,
          contentAddress,
          overrides,
        ),
      () =>
        this.secondary?.blockContentObject(
          stakingToken,
          contentAddress,
          overrides,
        ),
    );
  }
  public unblockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, any> {
    return this.fallback(
      () =>
        this.primary.unblockContentObject(
          stakingToken,
          contentAddress,
          overrides,
        ),
      () =>
        this.secondary?.unblockContentObject(
          stakingToken,
          contentAddress,
          overrides,
        ),
    );
  }

  public listingDuration(): ResultAsync<
    number,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.listingDuration(),
      () => this.secondary?.listingDuration(),
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.createConsent(ownerAddress, baseUri, overrides),
      () => this.secondary?.createConsent(ownerAddress, baseUri, overrides),
    );
  }

  public estimateGasToCreateConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
  ): ResultAsync<bigint, ConsentFactoryContractError | BlockchainCommonErrors> {
    return this.fallback(
      () =>
        this.primary.estimateGasToCreateConsent(ownerAddress, baseUri, name),
      () =>
        this.secondary?.estimateGasToCreateConsent(ownerAddress, baseUri, name),
    );
  }

  public getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getDeployedConsents(),
      () => this.secondary?.getDeployedConsents(),
    );
  }
  public getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getMaxTagsPerListing(),
      () => this.secondary?.getMaxTagsPerListing(),
    );
  }
  public getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getListingDuration(),
      () => this.secondary?.getListingDuration(),
    );
  }
  public setListingDuration(
    listingDuration: number,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.setListingDuration(listingDuration),
      () => this.secondary?.setListingDuration(listingDuration),
    );
  }
  public setMaxTagsPerListing(
    maxTagsPerListing: number,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.setMaxTagsPerListing(maxTagsPerListing),
      () => this.secondary?.setMaxTagsPerListing(maxTagsPerListing),
    );
  }

  public getListingsForward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () =>
        this.primary.getListingsForward(
          tag,
          stakingToken,
          startingSlot,
          numberOfSlots,
          removeExpired,
        ),
      () =>
        this.secondary?.getListingsForward(
          tag,
          stakingToken,
          startingSlot,
          numberOfSlots,
          removeExpired,
        ),
    );
  }
  public getListingsBackward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () =>
        this.primary.getListingsBackward(
          tag,
          stakingToken,
          startingSlot,
          numberOfSlots,
          removeExpired,
        ),
      () =>
        this.secondary?.getListingsBackward(
          tag,
          stakingToken,
          startingSlot,
          numberOfSlots,
          removeExpired,
        ),
    );
  }
  public getTagTotal(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors> {
    return this.fallback(
      () => this.primary.getTagTotal(tag, stakingToken),
      () => this.secondary?.getTagTotal(tag, stakingToken),
    );
  }
  public getListingsByTag(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getListingsByTag(tag, stakingToken, removeExpired),
      () => this.secondary?.getListingsByTag(tag, stakingToken, removeExpired),
    );
  }

  public getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError> {
    return this.fallback(
      () => this.primary.getAddressOfConsentCreated(txRes),
      () => this.secondary?.getAddressOfConsentCreated(txRes),
    );
  }

  public getQuestionnaires(): ResultAsync<
    IpfsCID[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getQuestionnaires(),
      () => this.secondary?.getQuestionnaires(),
    );
  }

  public addQuestionnaire(
    ipfsCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.addQuestionnaire(ipfsCid, overrides),
      () => this.secondary?.addQuestionnaire(ipfsCid, overrides),
    );
  }

  public removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.removeQuestionnaire(index, overrides),
      () => this.secondary?.removeQuestionnaire(index, overrides),
    );
  }

  public addDomain(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
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
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.removeDomain(domain),
      () => this.secondary?.removeDomain(domain),
    );
  }

  public checkDomain(
    domain: DomainName,
  ): ResultAsync<
    boolean,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.checkDomain(domain),
      () => this.secondary?.checkDomain(domain),
    );
  }
}
