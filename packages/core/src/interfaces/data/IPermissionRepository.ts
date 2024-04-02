import {
  EVMContractAddress,
  PersistenceError,
  DomainName,
  EDataWalletPermission,
  Permission,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPermissionRepository {
  getContractPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<Permission, PersistenceError>;

  setContractPermissions(
    permission: Permission,
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
