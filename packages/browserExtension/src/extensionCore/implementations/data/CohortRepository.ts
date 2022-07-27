import { ICohortRepository } from "@interfaces/data";
import { IErrorUtils } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
  ConsentContractError,
  ConsentContractRepositoryError,
  DomainName,
  EInvitationStatus,
  ISnickerdoodleCore,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class CohortRepository implements ICohortRepository{
  constructor(
    protected core: ISnickerdoodleCore,
    protected errorUtils: IErrorUtils,
  ) {}
  public getCohortInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<CohortInvitation, SnickerDoodleCoreError> {
    return this.core.getCohortInvitationByDomain(domain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.core.checkInvitationStatus(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
