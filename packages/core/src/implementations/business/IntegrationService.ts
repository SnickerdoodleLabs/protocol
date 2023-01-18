import {
  PersistenceError,
  DomainName,
  EDataWalletPermission,
  UnauthorizedError,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
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
  protected permissionGrants = new Map<
    DomainName,
    (grantedPermissions: EDataWalletPermission[]) => void
  >();
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
  ): ResultAsync<void, PersistenceError> {
    return this.getPermissions(domain)
      .andThen((currentPermissions) => {
        // Calculate the total permission set.
        const permSet = new Set(currentPermissions);

        permissions.forEach((perm) => {
          permSet.add(perm);
        });

        const totalPermissions = Array.from(permSet.values());

        return ResultUtils.combine([
          this.contextProvider.getContext(),
          this.dataWalletPersistence.setPermissions(domain, totalPermissions),
        ]).map(([context]) => {
          // Let the world know somebody got permissions
          context.publicEvents.onPermissionsGranted.next(
            new PermissionsGrantedEvent(domain, permissions),
          );

          // Check if there are any permissions requests outstanding
          const permissionRequest = this.permissionGrants.get(domain);

          if (permissionRequest != null) {
            permissionRequest(permissions);
          }
        });
      })
      .mapErr((e) => {
        return new PersistenceError(
          "Somehow, we got an unauthorized error in grantPermissions, converting to persistence error.",
          e,
        );
      });
  }

  public revokePermissions(
    domain: DomainName,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.dataWalletPersistence.setPermissions(domain, []),
    ]).map(([context]) => {
      context.publicEvents.onPermissionsRevoked.next(domain);
    });
  }

  public requestPermissions(
    requestedPermissions: EDataWalletPermission[],
    sourceDomain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.dataWalletPersistence.getPermissions(sourceDomain),
    ])
      .andThen(([context, existingPermissions]) => {
        // Figure out which permissions they actually need
        const neededPermissions = requestedPermissions.filter((rp) => {
          return !existingPermissions.includes(rp);
        });

        // We need to request the permissions
        context.publicEvents.onPermissionsRequested.next(
          new PermissionsRequestedEvent(
            sourceDomain,
            existingPermissions,
            neededPermissions,
          ),
        );

        // We're going to create a promise and stash it; when the FF calls grantPermissions
        // we'll resolve this and return
        const grantPromise = new Promise<EDataWalletPermission[]>((resolve) => {
          this.permissionGrants.set(sourceDomain, resolve);
        });

        return ResultAsync.fromSafePromise(grantPromise);
      })
      .andThen((grantedPermissions) => {
        return this.getPermissions(sourceDomain)
          .map((allPermissions) => {
            return allPermissions;
          })
          .mapErr((e) => {
            return new PersistenceError(
              "Somehow, we got an unauthorized error in requestPermissions, converting to persistence error.",
              e,
            );
          });
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
