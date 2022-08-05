import {
  Invitation,
  ConsentConditions,
  DomainName,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IInvitationService } from "@interfaces/business";
import {
  IInvitationRepository,
  IInvitationRepositoryType,
} from "@interfaces/data/IInvitationRepository";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

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
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.acceptInvitation(
      invitation,
      consentConditions,
    );
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.rejectInvitation(invitation);
  }
  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
}
