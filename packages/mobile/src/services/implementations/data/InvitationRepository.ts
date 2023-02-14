import {
  PageInvitation,
  Invitation,
  EInvitationStatus,
  DataPermissions,
  EVMContractAddress,
  IpfsCID,
  IOpenSeaMetadata,
  HexString32,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IInvitationRepository } from "../../interfaces/data/IInvitationRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class InvitationRepository implements IInvitationRepository {
  getInvitationsByDomain(
    domain: string,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    throw new Error("Method not implemented.");
  }
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    throw new Error("Method not implemented.");
  }
  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<HexString32, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
}
