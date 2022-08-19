import {
  Invitation,
  ConsentConditions,
  DomainName,
  EInvitationStatus,
  ISnickerdoodleCore,
  PageInvitation,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IInvitationRepository } from "@interfaces/data/IInvitationRepository";
import { IErrorUtils, IErrorUtilsType } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
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
