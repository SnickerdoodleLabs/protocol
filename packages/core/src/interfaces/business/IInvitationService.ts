import {
  AjaxError,
  BlockchainProviderError,
  Invitation,
  DataPermissions,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  MinimalForwarderContractError,
  PersistenceError,
  UninitializedError,
  PageInvitation,
  IPFSError,
  IOldUserAgreement,
  ConsentFactoryContractError,
  IpfsCID,
  HexString32,
  AccountAddress,
  IConsentCapacity,
  UnixTimestamp,
  BlockchainCommonErrors,
  OptInInfo,
  IUserAgreement,
  InvalidParametersError,
  CircuitError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationService {
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<
    EInvitationStatus,
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | BlockchainCommonErrors
  >;

  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | InvalidParametersError
    | CircuitError
    | ConsentError
  >;

  rejectInvitation(
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
  ): ResultAsync<
    void,
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
    | BlockchainCommonErrors
  >;

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentContractError
    | ConsentError
    | PersistenceError
    | BlockchainCommonErrors
  >;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError>;
  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError>;
  getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, PersistenceError>;

  getAcceptedInvitations(): ResultAsync<
    OptInInfo[],
    PersistenceError | UninitializedError
  >;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
    | PersistenceError
    | BlockchainCommonErrors
  >;

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
    | BlockchainCommonErrors
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, IPFSError>;

  getDataPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    DataPermissions,
    UninitializedError | ConsentError | PersistenceError
  >;
  updateDataPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    void,
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
    | ConsentError
  >;

  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
    | BlockchainCommonErrors
  >;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
