import {
  DataPermissions,
  EWalletDataType,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ExtensionStorageError } from "@shared/objects/errors";

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
  applyDefaultPermissionsOption: ResultAsync<boolean, ExtensionStorageError>;
  setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<void, ExtensionStorageError>;
}

export const IDataPermissionsUtilsType = Symbol.for("IDataPermissionsUtils");
