import {
  EVMContractAddress,
  PersistenceError,
  DomainName,
  EDataWalletPermission,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPermissionRepository {
  getDomainPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  setDomainPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError>;
}

export const IPermissionRepositoryType = Symbol.for("IPermissionRepository");
