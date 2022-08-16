import { IInvitationService } from "@interfaces/business";
import {
  IInvitationRepository,
  IInvitationRepositoryType,
} from "@interfaces/data/IInvitationRepository";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
  IOpenSeaMetadata,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(IInvitationRepositoryType)
    protected invitationRepository: IInvitationRepository,
    @inject(IContextProviderType) protected contexProvider: IContextProvider,
  ) {}

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
    dataPermissions: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.acceptInvitation(
      invitation,
      dataPermissions,
    );
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.rejectInvitation(invitation);
  }

  public getInvitationsMetadata(): ResultAsync<
    Map<EVMContractAddress, IOpenSeaMetadata>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getInvitationsMetadata();
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.leaveCohort(consentContractAddress);
  }
}
