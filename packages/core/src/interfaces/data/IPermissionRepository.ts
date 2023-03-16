import {
  DomainCredential,
  DomainName,
  EDataWalletPermission,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPermissionRepository {
  getPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  setPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError>;

  getDomainCredential(
    domain: DomainName,
  ): ResultAsync<DomainCredential | null, PersistenceError>;
  addDomainCredential(
    domainCredential: DomainCredential,
  ): ResultAsync<void, PersistenceError>;
}

export const IPermissionRepositoryType = Symbol.for("IPermissionRepository");
