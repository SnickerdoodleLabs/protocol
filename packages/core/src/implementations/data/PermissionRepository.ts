import {
  DataPermissions,
  EPermissionType,
  ERecordKey,
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
  Permission,
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

  public getDataPermissionsForByConsentContract(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions | null, PersistenceError> {
    return this.persistence
      .getObject<PermissionForStorage>(
        ERecordKey.PERMISSIONS,
        consentContractAddress,
      )
      .map((permissionStorage) => {
        if (permissionStorage == null) {
          return null;
        }
        const virtual: EWalletDataType[] = [];
        const questionnaires: IpfsCID[] = [];

        permissionStorage.permissions.forEach((permission) => {
          if (permission.allowed) {
            switch (permission.type) {
              case EPermissionType.Virtual:
                if (permission.virtual !== null) {
                  virtual.push(permission.virtual as EWalletDataType);
                }
                break;
              case EPermissionType.Questionnaires:
                if (permission.questionnaires !== null) {
                  questionnaires.push(permission.questionnaires as IpfsCID);
                }
                break;
            }
          }
        });

        return new DataPermissions(
          consentContractAddress,
          virtual.length > 0 ? virtual : null,
          questionnaires.length > 0 ? questionnaires : null,
        );
      });
  }
  public setDataPermissionsForByConsentContract(
    permission: PermissionForStorage,
  ) {
    return this.persistence.updateRecord<PermissionForStorage>(
      ERecordKey.PERMISSIONS,
      permission,
    );
  }
}
