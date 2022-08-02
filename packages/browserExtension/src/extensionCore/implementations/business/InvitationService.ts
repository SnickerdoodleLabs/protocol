import { IInvitationService } from "@interfaces/business";
import { IInvitationRepository } from "@interfaces/data/IInvitationRepository";
import { IContextProvider } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  Invitation,
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  DomainName,
  EInvitationStatus,
  PersistenceError,
  UninitializedError,
  PageInvitation,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export class InvitationService implements IInvitationService {
  constructor(
    protected invitationRepository: IInvitationRepository,
    protected contexProvider: IContextProvider,
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
