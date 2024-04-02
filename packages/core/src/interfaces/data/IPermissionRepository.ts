import {
  EVMContractAddress,
  DataPermissions,
  PersistenceError,
  DomainName,
  EDataWalletPermission,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

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
