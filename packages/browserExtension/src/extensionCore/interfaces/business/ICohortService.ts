import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
  ConsentConditions,
  EInvitationStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IInvitationService {
  acceptInvitation(
    invitation: Invitation,
    consentConditions: ConsentConditions | null,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  rejectInvitation(
    invitation: Invitation,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getInvitationWithDomain(
    domain: string,
  ): ResultAsync<Invitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  getInvitationDetails(
    invitation: Invitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError>;
}
