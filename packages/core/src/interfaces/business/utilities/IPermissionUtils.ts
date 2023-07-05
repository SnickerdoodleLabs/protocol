import {
  DomainName,
  EDataWalletPermission,
  PersistenceError,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPermissionUtils {
  assureSourceDomainHasPermission(
    srcDomain: DomainName | null | undefined,
    permission: EDataWalletPermission,
  ): ResultAsync<void, UnauthorizedError | PersistenceError>;
}

export const IPermissionUtilsType = Symbol.for("IPermissionUtils");
