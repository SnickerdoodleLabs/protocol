import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  DomainName,
  EDataWalletPermission,
  PersistenceError,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IPermissionUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IPermissionRepository,
  IPermissionRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class PermissionUtils implements IPermissionUtils {
  public constructor(
    @inject(IPermissionRepositoryType)
    protected permissionRepo: IPermissionRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public assureSourceDomainHasPermission(
    srcDomain: DomainName | null,
    permission: EDataWalletPermission,
  ): ResultAsync<void, UnauthorizedError | PersistenceError> {
    // If the srcDomain is null, we can just skip everything. That's just a convienience to
    // anybody using this method.
    if (srcDomain == null) {
      return okAsync(undefined);
    }

    return this.permissionRepo
      .getPermissions(srcDomain)
      .andThen((permissions) => {
        if (permissions.includes(permission)) {
          return okAsync(undefined);
        }

        this.logUtils.warning(
          `Domain ${srcDomain} tried to perform an action that requires permission ${permission} but has only been granted the following permissions: ${permissions}`,
        );

        return errAsync(
          new UnauthorizedError(
            `Domain ${srcDomain} requires permission ${permission} but has only been granted the following permissions: ${permissions}`,
          ),
        );
      });
  }
}
