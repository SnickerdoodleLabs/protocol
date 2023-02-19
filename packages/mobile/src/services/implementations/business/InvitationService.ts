import {
  IContextProviderType,
  IContextProvider,
} from "@snickerdoodlelabs/core/src/interfaces/utilities";
import {
  Invitation,
  EInvitationStatus,
  EWalletDataType,
  EVMContractAddress,
  DomainName,
  PageInvitation,
  IpfsCID,
  IOpenSeaMetadata,
  MarketplaceListing,
  DataPermissions,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { IInvitationService } from "../../interfaces/business/IInvitationService";
import {
  IInvitationRepositoryType,
  IInvitationRepository,
} from "../../interfaces/data/IInvitationRepository";
import { MobileStorageError } from "../../interfaces/objects/errors/MobileStorageError";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";
import {
  IDataPermissionsUtils,
  IDataPermissionsUtilsType,
} from "../../interfaces/utils/IDataPermissionsUtils";
@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(IInvitationRepositoryType)
    protected invitationRepository: IInvitationRepository,
    @inject(IContextProviderType) protected contexProvider: IContextProvider,
    @inject(IDataPermissionsUtilsType)
    protected dataPermissionsUtils: IDataPermissionsUtils,
  ) {}

  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError> {
    return this.invitationRepository.getMarketplaceListings(count, headAt);
  }

  public getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError> {
    return this.invitationRepository.getListingsTotal();
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    return this.invitationRepository.getConsentContractCID(consentAddress);
  }

  public getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError> {
    return this.invitationRepository
      .getAgreementFlags(consentContractAddress)
      .andThen((flags) =>
        this.dataPermissionsUtils.getDataTypesFromFlagsString(flags),
      );
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getAvailableInvitationsCID();
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getAcceptedInvitationsCID();
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError> {
    return this.invitationRepository.getInvitationMetadataByCID(ipfsCID);
  }

  public getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    return this.invitationRepository.getInvitationsByDomain(domain);
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.invitationRepository.checkInvitationStatus(invitation);
  }

  public acceptInvitation(
    invitation: Invitation,
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<void, SnickerDoodleCoreError | MobileStorageError> {
    return this.getDataPermissions(dataTypes).andThen((dataPermissions) => {
      return this.invitationRepository.acceptInvitation(
        invitation,
        dataPermissions,
      );
    });
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.rejectInvitation(invitation);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.leaveCohort(consentContractAddress);
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
