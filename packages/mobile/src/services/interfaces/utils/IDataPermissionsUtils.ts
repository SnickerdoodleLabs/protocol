import {
  DataPermissions,
  EWalletDataType,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { MobileStorageError } from "../objects/errors/MobileStorageError";

export interface IDataPermissionsUtils {
  defaultFlags: ResultAsync<HexString32, MobileStorageError>;
  DefaultDataPermissions: ResultAsync<DataPermissions, MobileStorageError>;
  setDefaultFlagsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, MobileStorageError>;
  setDefaultFlagsToAll(): ResultAsync<void, MobileStorageError>;
  generateDataPermissionsClassWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<DataPermissions, never>;
  getDataTypesFromFlagsString(
    flags: HexString32,
  ): ResultAsync<EWalletDataType[], never>;
  applyDefaultPermissionsOption: ResultAsync<boolean, MobileStorageError>;
  setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<void, MobileStorageError>;
}

export const IDataPermissionsUtilsType = Symbol.for("IDataPermissionsUtils");
