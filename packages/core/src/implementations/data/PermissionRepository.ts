import {
  DataPermissions,
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

  public getDataPermissionsForByConsentContract(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions | null, PersistenceError> {
    return this.persistence
      .getObject<PermissionForStorage>(
        ERecordKey.PERMISSIONS,
        consentContractAddress,
      )
      .map((permissionForStorage) => {
        if (permissionForStorage == null) {
          return null;
        }
        return new DataPermissions(
          permissionForStorage.consentAddress,
          permissionForStorage.virtual,
          permissionForStorage.questionnaires,
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
