import { ICohortRepository } from "@interfaces/data";
import { IErrorUtils } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
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

  public getInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<Invitation[], SnickerDoodleCoreError> {
    return this.core.getInvitationsByDomain(domain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.core.checkInvitationStatus(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getInvitationDetails(
    invitation: Invitation,
  ): ResultAsync<JSON, SnickerDoodleCoreError> {
    return this.core.getInvitationDetails(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public acceptInvitation(
    invitation: Invitation,
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
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.rejectInvitation(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
