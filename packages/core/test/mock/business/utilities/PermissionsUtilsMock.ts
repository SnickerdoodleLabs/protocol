import {
  DomainName,
  EDataWalletPermission,
  PersistenceError,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IPermissionUtils } from "@core/interfaces/business/utilities";

export class PermissionsUtilsMock implements IPermissionUtils {
  public assureSourceDomainHasPermission(
    srcDomain: DomainName | null | undefined,
    permission: EDataWalletPermission,
  ): ResultAsync<void, PersistenceError | UnauthorizedError> {
    return okAsync(undefined);
  }
}
