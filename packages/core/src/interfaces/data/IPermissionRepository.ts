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
    dataPermissions: DataPermissions,
  ): ResultAsync<void, PersistenceError>;

  getDomainPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  setDomainPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError>;
}

export const IPermissionRepositoryType = Symbol.for("IPermissionRepository");
