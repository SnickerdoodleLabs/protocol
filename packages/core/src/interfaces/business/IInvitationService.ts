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
  IOpenSeaMetadata,
  ConsentFactoryContractError,
  IpfsCID,
  HexString32,
  Signature,
  TokenId,
  MarketplaceListing,
  AccountAddress,
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
  >;

  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentError
  >;

  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<
    void,
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
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

  getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError>;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    BlockchainProviderError | UninitializedError | ConsentContractError
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
  >;

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
  >;
  getOptInCapacityInfo(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    [number, number],
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError>;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | PersistenceError
    | ConsentFactoryContractError
  >;

  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
  >;

  getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<
    MarketplaceListing,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getListingsTotal(): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
