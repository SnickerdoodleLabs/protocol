import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  EInvitationStatus,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICohortRepository {
  getCohortInvitationWithDomain(
    domain: string,
  ): ResultAsync<CohortInvitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  getInvitationDetails(
    invitation: CohortInvitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  rejectInvitation(
    invitation: CohortInvitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}
