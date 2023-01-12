import {
  DomainName,
  PersistenceError,
  EDataWalletPermission,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIntegrationService {
  grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
  ): ResultAsync<void, PersistenceError>;

  /**
   * Returns the granted permissions for a particular domain
   * @param domain
   */
  getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EDataWalletPermission[], PersistenceError | UnauthorizedError>;
}

export const IIntegrationServiceType = Symbol.for("IIntegrationService");
