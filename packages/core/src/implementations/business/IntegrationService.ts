import {
  PersistenceError,
  DomainName,
  EDataWalletPermission,
  UnauthorizedError,
  PermissionsGrantedEvent,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IIntegrationService } from "@core/interfaces/business/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class IntegrationService implements IIntegrationService {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.dataWalletPersistence.setPermissions(domain, permissions),
    ]).map(([context]) => {
      // Let the world know somebody got permissions
      context.publicEvents.onPermissionsGranted.next(
        new PermissionsGrantedEvent(domain, permissions),
      );
    });
  }

  public getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    EDataWalletPermission[],
    PersistenceError | UnauthorizedError
  > {
    // If the sourceDomain is provided, it has to match the requested domain- you can't
    // get the permissions for any domain but your own.
    if (sourceDomain != null && sourceDomain != domain) {
      return errAsync(new UnauthorizedError());
    }

    return this.dataWalletPersistence.getPermissions(domain);
  }
}
