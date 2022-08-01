import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  Invitation,
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  EInvitationStatus,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICohortRepository {
  getInvitationWithDomain(
    domain: string,
  ): ResultAsync<Invitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  getInvitationDetails(
    invitation: Invitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}
