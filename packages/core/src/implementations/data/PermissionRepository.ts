import {
  DomainCredential,
  DomainName,
  EBackupPriority,
  EDataWalletPermission,
  EFieldKey,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IPermissionRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class PermissionRepository implements IPermissionRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public getPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError> {
    return this.persistence
      .getField<DomainPermissions>(
        EFieldKey.DOMAIN_PERMISSIONS,
        EBackupPriority.HIGH,
      )
      .map((domainPermissions) => {
        if (domainPermissions == null) {
          return [];
        }

        const permissions = domainPermissions[domain];

        if (permissions == null) {
          return [];
        }

        return permissions;
      });
  }

  public setPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<DomainPermissions>(
        EFieldKey.DOMAIN_PERMISSIONS,
        EBackupPriority.HIGH,
      )
      .andThen((domainPermissions) => {
        if (domainPermissions == null) {
          domainPermissions = {};
        }

        domainPermissions[domain] = permissions;

        return this.persistence.updateField(
          EFieldKey.DOMAIN_PERMISSIONS,
          domainPermissions,
          EBackupPriority.HIGH,
        );
      });
  }

  public getDomainCredential(
    domain: DomainName,
  ): ResultAsync<DomainCredential | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addDomainCredential(
    domainCredential: DomainCredential,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}

interface DomainPermissions {
  [key: DomainName]: EDataWalletPermission[] | undefined;
}
