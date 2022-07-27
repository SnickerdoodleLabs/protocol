import { ICohortService } from "@interfaces/business";
import { ICohortRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
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

export class CohortService implements ICohortService {
  constructor(
    protected cohortRepository: ICohortRepository,
    protected contexProvider: IContextProvider,
  ) {}

  public getCohortInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<CohortInvitation, SnickerDoodleCoreError> {
    return this.cohortRepository.getCohortInvitationWithDomain(domain);
  }

  public checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.cohortRepository.checkInvitationStatus(invitation);
  }

  public getInvitationDetailsWithDomain(
    domain: DomainName,
    sender: Runtime.MessageSender | null,
  ) {
    return this.cohortRepository
      .getCohortInvitationWithDomain(domain)
      .andThen((cohortInvitation: CohortInvitation) => {
        const invitation: CohortInvitation = cohortInvitation;
        return this.cohortRepository
          .checkInvitationStatus(invitation)
          .andThen((invitationStatus: EInvitationStatus) => {
            if (invitationStatus === EInvitationStatus.New) {
              return this.cohortRepository.getInvitationDetails(invitation);
            } else {
              return okAsync(null);
            }
          });
      });
  }
  public getInvitationDetails(
    invitation: CohortInvitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError> {
    return this.cohortRepository.getInvitationDetails(invitation);
  }

  public acceptInvitation(
    invitation: CohortInvitation,
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
    invitation: CohortInvitation,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    if (sender != "") {
      return okAsync(undefined);
    } else {
      return this.cohortRepository.rejectInvitation(invitation);
    }
  }
}
