import {
  DataPermissions,
  DomainName,
  EDataWalletPermission,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  Permission,
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

  public getContractPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<Permission, PersistenceError> {
    return this.persistence
      .getObject<Permission>(ERecordKey.PERMISSIONS, consentContractAddress)
      .map((permission) => {
        if (permission == null) {
          return new Permission(consentContractAddress, [], []);
        }
        return permission;
      });
  }

  public setContractPermissions(
    permission: Permission,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord<Permission>(
      ERecordKey.PERMISSIONS,
      permission,
    );
  }

  public getDomainPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError> {
    return this.persistence
      .getField<DomainPermissions>(EFieldKey.DOMAIN_PERMISSIONS)
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

  public setDomainPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<DomainPermissions>(EFieldKey.DOMAIN_PERMISSIONS)
      .andThen((domainPermissions) => {
        if (domainPermissions == null) {
          domainPermissions = {};
        }

        domainPermissions[domain] = permissions;

        return this.persistence.updateField(
          EFieldKey.DOMAIN_PERMISSIONS,
          domainPermissions,
        );
      });
  }
}

interface DomainPermissions {
  [key: DomainName]: EDataWalletPermission[] | undefined;
}
