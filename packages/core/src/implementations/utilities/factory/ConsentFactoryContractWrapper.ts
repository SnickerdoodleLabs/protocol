import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentRoles,
  ContractOverrides,
  IConsentContract,
  IConsentContractFilters,
  IConsentFactoryContract,
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
  ConsentFactoryContractError,
  ConsentName,
  MarketplaceListing,
  MarketplaceTag,
  TransactionResponseError,
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
  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.createConsent(ownerAddress, baseUri, name, overrides),
      () =>
        this.secondary?.createConsent(ownerAddress, baseUri, name, overrides),
    );
  }
  public getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getUserDeployedConsentsCount(ownerAddress),
      () => this.secondary?.getUserDeployedConsentsCount(ownerAddress),
    );
  }
  public getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return this.fallback(
      () =>
        this.primary.getUserDeployedConsentsByIndex(
          ownerAddress,
          startingIndex,
          endingIndex,
        ),
      () =>
        this.secondary?.getUserDeployedConsentsByIndex(
          ownerAddress,
          startingIndex,
          endingIndex,
        ),
    );
  }
  public getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getUserDeployedConsents(ownerAddress),
      () => this.secondary?.getUserDeployedConsents(ownerAddress),
    );
  }
  public getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getUserRoleAddressesCount(ownerAddress, role),
      () => this.secondary?.getUserRoleAddressesCount(ownerAddress, role),
    );
  }
  public getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return this.fallback(
      () =>
        this.primary.getUserRoleAddressesCountByIndex(
          ownerAddress,
          role,
          startingIndex,
          endingIndex,
        ),
      () =>
        this.secondary?.getUserRoleAddressesCountByIndex(
          ownerAddress,
          role,
          startingIndex,
          endingIndex,
        ),
    );
  }
  public getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.getDeployedConsents(),
      () => this.secondary?.getDeployedConsents(),
    );
  }
  public getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.getMaxTagsPerListing(),
      () => this.secondary?.getMaxTagsPerListing(),
    );
  }
  public getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError
  > {
    return this.fallback(
      () => this.primary.getListingDuration(),
      () => this.secondary?.getListingDuration(),
    );
  }
  public setListingDuration(
    listingDuration: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.setListingDuration(listingDuration),
      () => this.secondary?.setListingDuration(listingDuration),
    );
  }
  public setMaxTagsPerListing(
    maxTagsPerListing: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.setMaxTagsPerListing(maxTagsPerListing),
      () => this.secondary?.setMaxTagsPerListing(maxTagsPerListing),
    );
  }
  public adminRemoveListing(
    tag: MarketplaceTag,
    removedSlot: BigNumberString,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.adminRemoveListing(tag, removedSlot),
      () => this.secondary?.adminRemoveListing(tag, removedSlot),
    );
  }
  public getListingDetail(
    tag: MarketplaceTag,
    slot: BigNumberString,
  ): ResultAsync<MarketplaceListing, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getListingDetail(tag, slot),
      () => this.secondary?.getListingDetail(tag, slot),
    );
  }
  public getListingsForward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    return this.fallback(
      () =>
        this.primary.getListingsForward(
          tag,
          startingSlot,
          numberOfSlots,
          filterActive,
        ),
      () =>
        this.secondary?.getListingsForward(
          tag,
          startingSlot,
          numberOfSlots,
          filterActive,
        ),
    );
  }
  public getListingsBackward(
    tag: MarketplaceTag,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    return this.fallback(
      () =>
        this.primary.getListingsBackward(
          tag,
          startingSlot,
          numberOfSlots,
          filterActive,
        ),
      () =>
        this.secondary?.getListingsBackward(
          tag,
          startingSlot,
          numberOfSlots,
          filterActive,
        ),
    );
  }
  public getTagTotal(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getTagTotal(tag),
      () => this.secondary?.getTagTotal(tag),
    );
  }
  public getListingsByTag(
    tag: MarketplaceTag,
    removeExpired: boolean,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    return this.fallback(
      () => this.primary.getListingsByTag(tag, removeExpired),
      () => this.secondary?.getListingsByTag(tag, removeExpired),
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
}
