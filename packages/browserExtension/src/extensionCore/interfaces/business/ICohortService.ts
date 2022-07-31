import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  CohortInvitation,
  ConsentConditions,
  EInvitationStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface ICohortService {
  acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  rejectInvitation(
    invitation: CohortInvitation,
    sender: Runtime.MessageSender | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getCohortInvitationWithDomain(
    domain: string,
  ): ResultAsync<CohortInvitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  getInvitationDetails(
    invitation: CohortInvitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError>;
}
