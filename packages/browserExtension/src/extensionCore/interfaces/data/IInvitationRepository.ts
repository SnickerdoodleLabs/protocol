import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
  IOpenSeaMetadata,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

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
  getInvitationsMetadata(): ResultAsync<
    Map<EVMContractAddress, IOpenSeaMetadata>,
    SnickerDoodleCoreError
  >;
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
