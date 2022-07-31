import { ICohortRepository } from "@interfaces/data";
import { IErrorUtils } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  CohortInvitation,
  ConsentConditions,
  DomainName,
  EInvitationStatus,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class CohortRepository implements ICohortRepository {
  constructor(
    protected core: ISnickerdoodleCore,
    protected errorUtils: IErrorUtils,
  ) {}

  public getCohortInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<CohortInvitation[], SnickerDoodleCoreError> {
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
  public getInvitationDetails(
    invitation: CohortInvitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError> {
    return this.core.getInvitationDetails(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .acceptInvitation(invitation, consentConditions)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public rejectInvitation(
    invitation: CohortInvitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.rejectInvitation(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
