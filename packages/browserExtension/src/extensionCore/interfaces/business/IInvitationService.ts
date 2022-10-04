import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
  DomainName,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  HexString32,
  EWalletDataType,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ExtensionStorageError,
  SnickerDoodleCoreError,
} from "@shared/objects/errors";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError>;

  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError>;

  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;

  getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError>;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
