import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
  ConsentConditions,
  EInvitationStatus,
  PageInvitation,
  DomainName,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");