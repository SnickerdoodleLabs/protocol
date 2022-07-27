import { ICohortService } from "@interfaces/business";
import { ICohortRepository } from "@interfaces/data";
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

export class CohortService implements ICohortService {
  constructor(protected cohortRepository: ICohortRepository) {}
  public getCohortInvitationWithDomain(
    domain: string,
  ): ResultAsync<CohortInvitation, SnickerDoodleCoreError> {
    return this.cohortRepository.getCohortInvitationWithDomain(domain);
  }

  public checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.cohortRepository.checkInvitationStatus(invitation);
  }
}
