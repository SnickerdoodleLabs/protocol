import {
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EInvitationStatus,
  EVMContractAddress,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICohortService {
  checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<
    EInvitationStatus,
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  >;

  acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, UninitializedError | PersistenceError | AjaxError>;

  rejectInvitation(
    invitation: CohortInvitation,
  ): ResultAsync<
    void,
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  >;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  >;
}

export const ICohortServiceType = Symbol.for("ICohortService");
