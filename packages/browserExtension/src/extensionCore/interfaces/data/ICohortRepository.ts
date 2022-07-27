import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
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
  ): ResultAsync<CohortInvitation, SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> 
}
