import { ResultAsync } from "neverthrow";
import {
  EVMContractAddress,
  DataPermissions,
  PersistenceError,
  PermissionForStorage,
  DomainName,
  EDataWalletPermission,
  Permission,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";

export interface IPermissionRepository {
  getContentContractPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions, PersistenceError>;

  setContentContractPermissions(
    consentContractAddress: EVMContractAddress,
    virtual: EWalletDataType[],
    questionnaires: IpfsCID[],
  ): ResultAsync<DataPermissions, PersistenceError>;

  getDomainPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  setDomainPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError>;
}

export const IPermissionRepositoryType = Symbol.for("IPermissionRepository");
