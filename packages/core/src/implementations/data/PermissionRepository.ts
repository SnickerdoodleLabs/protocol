import {
  DataPermissions,
  DomainName,
  EDataWalletPermission,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  PermissionForStorage,
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

  public getContentContractPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions, PersistenceError> {
    return this.persistence
      .getObject<PermissionForStorage>(
        ERecordKey.PERMISSIONS,
        consentContractAddress,
      )
      .map((permissionStorage) => {
        if (permissionStorage == null) {
          return new DataPermissions(consentContractAddress, [], []);
        }
        return new DataPermissions(
          permissionStorage.consentAddress,
          permissionStorage.virtual,
          permissionStorage.questionnaires,
        );
      });
  }

  public setContentContractPermissions(
    dataPermissions: DataPermissions,
  ): ResultAsync<void, PersistenceError> {
    const permission = new PermissionForStorage(
      dataPermissions.consentContractAddress,
      dataPermissions.virtual,
      dataPermissions.questionnaires,
    );
    return this.persistence.updateRecord<PermissionForStorage>(
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
