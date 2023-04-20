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
  PersistenceError,
  ConsentContractRepositoryError,
  ConsentContractError,
  BlockchainProviderError,
  UninitializedError,
  AjaxError,
  MinimalForwarderContractError,
  ConsentError,
  AccountAddress,
  ConsentFactoryContractError,
  IPFSError,
  IConsentCapacity,
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
    dataPermissions: DataPermissions | null,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;

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

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError>;

  getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError>;

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;
  getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, SnickerDoodleCoreError>;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError>;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<HexString32, SnickerDoodleCoreError>;

  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  >;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
