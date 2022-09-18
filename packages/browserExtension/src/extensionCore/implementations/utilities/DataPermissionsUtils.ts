import { IDataPermissionsUtils } from "@interfaces/utilities";
import { ExtensionStorageError } from "@shared/objects/errors";
import {
  EWalletDataType,
  HexString32,
  DataPermissions,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

export const dependedFlags = {
  [EWalletDataType.Age]: [EWalletDataType.Birthday],
  [EWalletDataType.Birthday]: [EWalletDataType.Age],
};
@injectable()
export class DataPermissionsUtils implements IDataPermissionsUtils {
  public get defaultFlags(): ResultAsync<HexString32, ExtensionStorageError> {
    return ResultAsync.fromPromise(
      Browser.storage.local.get("defaultFlags"),
      (e) => new ExtensionStorageError("could not read key defaultFlags"),
    ).map((res) => {
      if (res.defaultFlags) {
        return res.defaultFlags as HexString32;
      }
      return HexString32(
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      );
    });
  }

  public get DefaultDataPermissions(): ResultAsync<
    DataPermissions,
    ExtensionStorageError
  > {
    return this.defaultFlags.andThen((flags) => {
      return okAsync(new DataPermissions(flags));
    });
  }

  public setDefaultFlagsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ExtensionStorageError> {
    return this.generateDataPermissionsClassWithDataTypes(dataTypes).andThen(
      (permissionsClass) => {
        return this.setDefaultFlags(permissionsClass.getFlags());
      },
    );
  }

  public setDefaultFlagsToAll(): ResultAsync<void, ExtensionStorageError> {
    return this.setDefaultFlags(
      HexString32(
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      ),
    );
  }

  public generateDataPermissionsClassWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<DataPermissions, never> {
    const _dataTypes = dataTypes.reduce((acc, dataType) => {
      acc = Array.from(
        new Set([
          ...acc,
          dataType,
          ...(dependedFlags[dataType] != null ? dependedFlags[dataType] : []),
        ]),
      );
      return acc;
    }, [] as EWalletDataType[]);
    return okAsync(DataPermissions.createWithPermissions(_dataTypes));
  }

  public getDataTypesFromFlagsString(
    flags: HexString32,
  ): ResultAsync<EWalletDataType[], never> {
    const _DataPermissions = new DataPermissions(flags);
    // The following loop assumes that the getters of the flags written for the flag keys in the DataPermissions Class are defined with the same name.
    const dataTypes = Object.keys(EWalletDataType).reduce((acc, key) => {
      const isGranted: EWalletDataType | undefined = _DataPermissions[key];
      if (isGranted) {
        acc = [...acc, EWalletDataType[key]];
      }
      return acc;
    }, [] as EWalletDataType[]);

    return okAsync(dataTypes);
  }

  protected setDefaultFlags(
    flag: HexString32,
  ): ResultAsync<void, ExtensionStorageError> {
    return ResultAsync.fromPromise(
      Browser.storage.local.set({
        defaultFlags: flag,
      }),
      (e) => new ExtensionStorageError("could not set value of defaultFlags"),
    );
  }
}
