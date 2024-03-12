import {
  DataPermissions,
  DomainCredential,
  DomainName,
  EDataWalletPermission,
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
  PermissionForStorage,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPermissionRepository {
  getDataPermissionsForByConsentContract(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions | null, PersistenceError>;

  setDataPermissionsForByConsentContract(
    permission: PermissionForStorage,
  ): ResultAsync<void, PersistenceError>;
}

export const IPermissionRepositoryType = Symbol.for("IPermissionRepository");
