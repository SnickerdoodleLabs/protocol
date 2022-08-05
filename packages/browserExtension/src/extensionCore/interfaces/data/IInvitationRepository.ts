import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
  ConsentConditions,
  EInvitationStatus,
  PageInvitation,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationRepository {
  getInvitationsByDomain(
    domain: string,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;
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
}

export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
