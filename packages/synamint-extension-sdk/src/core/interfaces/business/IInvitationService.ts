import {
  Invitation,
  DataPermissions,
  EInvitationStatus,
  PageInvitation,
  DomainName,
  EVMContractAddress,
  IOldUserAgreement,
  IpfsCID,
  EWalletDataType,
  MarketplaceListing,
  AccountAddress,
  IConsentCapacity,
  PossibleReward,
  PagingRequest,
  MarketplaceTag,
  PagedResponse,
  UnixTimestamp,
  EarnedReward,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ExtensionStorageError,
  SnickerDoodleCoreError,
} from "@synamint-extension-sdk/shared/objects/errors";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError>;

  updateAgreementPermissions(
    consentContractAddress: EVMContractAddress,
    dataTypes: DataPermissions,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  acceptInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError>;

  rejectInvitation(
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
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
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError>;

  getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  >;
  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;

  getDataPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions, SnickerDoodleCoreError>;

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

export const IInvitationServiceType = Symbol.for("IInvitationService");
