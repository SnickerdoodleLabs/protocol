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

  getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError> {
    return this.core.marketplace
      .getMarketplaceListings(count, headAt)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core.marketplace.getListingsTotal().mapErr((error) => {
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

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.core.getAcceptedInvitationsCID().mapErr((error) => {
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

  acceptInvitation(
    invitation: Invitation,
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<void, SnickerDoodleCoreError | MobileStorageError> {
    // TODO MOBILE DATAPERMISSIONS
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

  protected getDataPermissions(
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<DataPermissions | null, never | MobileStorageError> {
    return this.dataPermissionsUtils.applyDefaultPermissionsOption.andThen(
      (option) => {
        if (option) {
          return this.dataPermissionsUtils.DefaultDataPermissions;
        }
        if (dataTypes) {
          return this.dataPermissionsUtils.generateDataPermissionsClassWithDataTypes(
            dataTypes,
          );
        }
        return okAsync(null);
      },
    );
  }
}
