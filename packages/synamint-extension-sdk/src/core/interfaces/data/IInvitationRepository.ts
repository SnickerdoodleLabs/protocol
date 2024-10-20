import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
  IOldUserAgreement,
  IpfsCID,
  HexString32,
  MarketplaceListing,
  AccountAddress,
  IConsentCapacity,
  PossibleReward,
  PagingRequest,
  MarketplaceTag,
  PagedResponse,
  EarnedReward,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IInvitationRepository {
  getInvitationsByDomain(
    domain: string,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;
  acceptInvitation(
    invitation: Invitation,
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
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError>;
  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;
  getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  >;
  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError>;
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError>;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, SnickerDoodleCoreError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError>;
}

export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
