import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  HexString32,
  MarketplaceListing,
  AccountAddress,
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
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;
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
  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<HexString32, SnickerDoodleCoreError>;
  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError>;
  getMarketplaceListings(
    count?: number,
    headAt?: number,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError>;
  getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getDefaultReceivingAddress(): ResultAsync<
    AccountAddress | null, 
    SnickerDoodleCoreError
  >;
  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getReceivingAddress(
    contractAddress: EVMContractAddress,
  ): ResultAsync<AccountAddress | null, SnickerDoodleCoreError>;

}

export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
