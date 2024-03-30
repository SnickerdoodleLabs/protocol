import { injectable, inject } from "inversify";
import {
  DomainName,
  EInvitationStatus,
  Invitation,
  OptInInfo,
  PageInvitation,
  EVMContractAddress,
  IpfsCID,
  DataPermissions,
  UnixTimestamp,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  IOldUserAgreement,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { IInvitationService } from "../../interfaces/business/IInvitationService";
import { ResultAsync } from "neverthrow";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(ISnickerdoodleCoreType) private core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) private errorUtils: IErrorUtils,
  ) {}

  public checkInvitationStatus(
    invitation: Invitation,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.core.invitation
      .checkInvitationStatus(invitation, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .acceptInvitation(invitation, dataPermissions, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public rejectInvitation(
    invitation: Invitation,
    rejectUntil: UnixTimestamp | undefined = undefined,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .rejectInvitation(invitation, rejectUntil, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .leaveCohort(consentContractAddress, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAcceptedInvitations(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<OptInInfo[], SnickerDoodleCoreError> {
    return this.core.invitation
      .getAcceptedInvitations(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getInvitationsByDomain(
    domain: DomainName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    return this.core.invitation
      .getInvitationsByDomain(domain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    // HexString32 could be a specific type if you defined it
    return this.core.invitation
      .getAgreementFlags(consentContractAddress, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAvailableInvitationsCID(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Map<EVMContractAddress, IpfsCID>, SnickerDoodleCoreError> {
    return this.core.invitation
      .getAvailableInvitationsCID(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAcceptedInvitationsCID(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Map<EVMContractAddress, IpfsCID>, SnickerDoodleCoreError> {
    return this.core.invitation
      .getAcceptedInvitationsCID(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError> {
    return this.core.invitation
      .getInvitationMetadataByCID(ipfsCID)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public updateDataPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .updateDataPermissions(
        consentContractAddress,
        dataPermissions,
        sourceDomain,
      )
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }
}
