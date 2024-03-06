import {
  DomainName,
  EInvitationStatus,
  Invitation,
  OptInInfo,
  PageInvitation,
  EVMContractAddress,
  IpfsCID,
  DataPermissions,
  UnixTimestamp,
  IOldUserAgreement,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  rejectInvitation(
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getAcceptedInvitations(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<OptInInfo[], SnickerDoodleCoreError>;

  getInvitationsByDomain(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<string, SnickerDoodleCoreError>; // HexString32 type might be specific, replace with string if not applicable

  getAvailableInvitationsCID(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Map<EVMContractAddress, IpfsCID>, SnickerDoodleCoreError>;

  getAcceptedInvitationsCID(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Map<EVMContractAddress, IpfsCID>, SnickerDoodleCoreError>;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError>;

  updateDataPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}
export const IInvitationServiceType = Symbol.for("IInvitationService");
