import { ExtensionStorageError } from "@shared/objects/errors";
import {
  DataPermissions,
  EWalletDataType,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDataPermissionsUtils {
  defaultFlags: ResultAsync<HexString32, ExtensionStorageError>;
  DefaultDataPermissions: ResultAsync<DataPermissions, ExtensionStorageError>;
  setDefaultFlagsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ExtensionStorageError>;
  setDefaultFlagsToAll(): ResultAsync<void, ExtensionStorageError>;
  generateDataPermissionsClassWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<DataPermissions, never>;
  getDataTypesFromFlagsString(
    flags: HexString32,
  ): ResultAsync<EWalletDataType[], never>;
}

export const IDataPermissionsUtilsType = Symbol.for("IDataPermissionsUtils");
