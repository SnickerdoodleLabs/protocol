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
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import {
  IInvitationService,
  IInvitationServiceType,
} from "../../interfaces/business/IInvitationService";

import {
  IDataPermissionsRepository,
  IDataPermissionsRepositoryType,
} from "../../interfaces/data/IDataPermissionsRepository";
import {
  IInvitationRepository,
  IInvitationRepositoryType,
} from "../../interfaces/data/IInvitationRepository";
import { MobileStorageError } from "../../interfaces/objects/errors/MobileStorageError";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(IInvitationRepositoryType)
    protected invitationRepository: IInvitationRepository,
    @inject(IDataPermissionsRepositoryType)
    protected dataPermissionsUtils: IDataPermissionsRepository,
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
    // MOBILE_TODO Should add datapermission
    return this.invitationRepository.acceptInvitation(invitation, null);
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
