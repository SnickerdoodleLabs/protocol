import { IInvitationService } from "@interfaces/business";
import { ICohortRepository } from "@interfaces/data";
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
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export class InvitationService implements IInvitationService {
  constructor(
    protected cohortRepository: ICohortRepository,
    protected contexProvider: IContextProvider,
  ) {}

  public getInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<Invitation[], SnickerDoodleCoreError> {
    return this.cohortRepository.getInvitationWithDomain(domain);
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.cohortRepository.checkInvitationStatus(invitation);
  }

  public getInvitationDetailsWithDomain(domain: DomainName) {
    return (
      this.cohortRepository
        .getInvitationWithDomain(domain)
        // @ts-ignore /// getInvitationWithDomain should be delete
        .andThen((cohortInvitation: Invitation) => {
          const invitation: Invitation = cohortInvitation;
          return this.cohortRepository
            .checkInvitationStatus(invitation)
            .andThen((invitationStatus: EInvitationStatus) => {
              if (invitationStatus === EInvitationStatus.New) {
                return this.cohortRepository.getInvitationDetails(invitation);
              } else {
                return okAsync(null);
              }
            });
        })
    );
  }
  public getInvitationDetails(
    invitation: Invitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError> {
    return this.cohortRepository.getInvitationDetails(invitation);
  }

  public acceptInvitation(
    invitation: Invitation,
    consentConditions: ConsentConditions | null,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    if (sender != "") {
      return okAsync(undefined);
    } else {
      return this.cohortRepository.acceptInvitation(
        invitation,
        consentConditions,
      );
    }
  }
  public rejectInvitation(
    invitation: Invitation,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    if (sender != "") {
      return okAsync(undefined);
    } else {
      return this.cohortRepository.rejectInvitation(invitation);
    }
  }
}
