import {
  Invitation,
  EInvitationStatus,
  EWalletDataType,
  EVMContractAddress,
  DomainName,
  PageInvitation,
  IpfsCID,
  IOpenSeaMetadata,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IInvitationService } from "../../interfaces/business/IInvitationService";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class InvitationService implements IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  acceptInvitation(
    invitation: Invitation,
    dataTypes: EWalletDataType[] | null,
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
  getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
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
  getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError> {
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
