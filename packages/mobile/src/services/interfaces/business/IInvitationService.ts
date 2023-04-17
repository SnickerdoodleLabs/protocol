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
  Signature,
  TokenId,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { MobileStorageError } from "../objects/errors/MobileStorageError";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
    dataTypes: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError | MobileStorageError>;

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

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError>;

  getMarketplaceListings(
    count?: number,
    headAt?: number,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError>;

  getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError>;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
