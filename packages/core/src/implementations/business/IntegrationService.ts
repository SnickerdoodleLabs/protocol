import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  PersistenceError,
  DomainName,
  EDataWalletPermission,
  UnauthorizedError,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  JsonWebToken,
  InvalidSignatureError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { errAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IIntegrationService } from "@core/interfaces/business/index.js";
import {
  IPermissionRepository,
  IPermissionRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class IntegrationService implements IIntegrationService {
  protected permissionGrants = new Map<
    DomainName,
    (grantedPermissions: EDataWalletPermission[]) => void
  >();
  constructor(
    @inject(IPermissionRepositoryType)
    protected permissionRepo: IPermissionRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
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
          this.permissionRepo.setPermissions(domain, totalPermissions),
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
      this.permissionRepo.setPermissions(domain, []),
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
      this.permissionRepo.getPermissions(sourceDomain),
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

    return this.permissionRepo.getPermissions(domain);
  }

  public getBearerToken(
    nonce: string,
    domain: DomainName,
  ): ResultAsync<JsonWebToken, InvalidSignatureError> {
    // When a domain requests a token, it must check if we have already created an ID for this
    // domain (along with a key)
    // First, we need to derive a keypair for the domain that we'll use to sign the JWT with
    // We'll use an asymetric algorithm for signing.
    return ResultAsync.fromPromise(
      new Promise<JsonWebToken>((resolve, reject) =>
        jwt.sign(
          {
            nonce: nonce,
            aud: domain,
          } as IUserTokenPayload,
          config.tokenSigningKey,
          {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: config.tokenIssuer,
          },
          (err, token) => {
            if (err) {
              return reject(err);
            }
            if (!token) {
              return new InvalidSignatureError("Empty token");
            }
            return resolve(JsonWebToken(token));
          },
        ),
      ),
      (e) => {
        return e as InvalidSignatureError;
      },
    );
  }
}

interface IUserTokenPayload extends jwt.JwtPayload {
  gty?: string;
  azp?: string;
}
