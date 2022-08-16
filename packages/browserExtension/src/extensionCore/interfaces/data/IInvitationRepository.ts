import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IInvitationRepository {
  getInvitationsByDomain(
    domain: string,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
