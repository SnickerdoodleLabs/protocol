import {
  MarketplaceListing,
  EVMContractAddress,
  IpfsCID,
  EWalletDataType,
  IOpenSeaMetadata,
  DomainName,
  PageInvitation,
  Invitation,
  EInvitationStatus,
  DataPermissions,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  HexString32,
  AccountAddress,
  PossibleReward,
  IConsentCapacity,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { IInvitationService } from "../../interfaces/business/IInvitationService";
import {
  IDataPermissionsRepository,
  IDataPermissionsRepositoryType,
} from "../../interfaces/data/IDataPermissionsRepository";
import { MobileStorageError } from "../../interfaces/objects/errors/MobileStorageError";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";

@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IDataPermissionsRepositoryType)
    protected dataPermissionsUtils: IDataPermissionsRepository,
  ) {}
  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.core.getAcceptedInvitationsCID().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive: boolean = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError> {
    return this.core.marketplace
      .getMarketplaceListingsByTag(pagingReq, tag, filterActive)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core.marketplace.getListingsTotalByTag(tag).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    return this.core.getConsentContractCID(consentAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<HexString32, SnickerDoodleCoreError> {
    return this.core
      .getAgreementFlags(consentContractAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.core.getAvailableInvitationsCID().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, SnickerDoodleCoreError> {
    return this.core
      .getConsentCapacity(consentContractAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number | undefined,
  ): ResultAsync<
    Map<EVMContractAddress, PossibleReward[]>,
    SnickerDoodleCoreError
  > {
    return this.core.marketplace
      .getPossibleRewards(contractAddresses, timeoutMs)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError> {
    return this.core.getInvitationMetadataByCID(ipfsCID).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    return this.core.getInvitationsByDomain(domain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.core.checkInvitationStatus(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .setDefaultReceivingAddress(receivingAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .setReceivingAddress(contractAddress, receivingAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError> {
    return this.core.getReceivingAddress(contractAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.acceptInvitation(invitation, null).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.rejectInvitation(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.leaveCohort(consentContractAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
