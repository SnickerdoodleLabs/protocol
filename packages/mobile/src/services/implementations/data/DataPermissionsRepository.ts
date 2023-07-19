import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EWalletDataType,
  HexString32,
  DataPermissions,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IDataPermissionsRepository } from "../../interfaces/data/IDataPermissionsRepository";
import { MobileStorageError } from "../../interfaces/objects/errors/MobileStorageError";

export const dependedFlags = {
  [EWalletDataType.Age]: [EWalletDataType.Birthday],
  [EWalletDataType.Birthday]: [EWalletDataType.Age],
};
@injectable()
export class DataPermissionsRepository implements IDataPermissionsRepository {
  public get defaultFlags(): ResultAsync<HexString32, MobileStorageError> {
    return ResultAsync.fromPromise(
      AsyncStorage.getItem("defaultFlags"),
      (e) => new MobileStorageError("could not read key defaultFlags"),
    ).map((res) => {
      const jsonValue = res != null ? JSON.parse(res) : null;
      if (jsonValue.defaultFlags) {
        return jsonValue.defaultFlags as HexString32;
      }
      return DataPermissions.allPermissionsHexString;
    });
  }

  // Move below two to settings utils later
  public get applyDefaultPermissionsOption(): ResultAsync<
    boolean,
    MobileStorageError
  > {
    return ResultAsync.fromPromise(
      AsyncStorage.getItem("applyDefaultPermissionsOption"),
      (e) =>
        new MobileStorageError(
          "could not read key applyDefaultPermissionsOption",
        ),
    ).map((res) => {
      const jsonValue = res != null ? JSON.parse(res) : null;
      if (jsonValue.applyDefaultPermissionsOption) {
        return jsonValue.applyDefaultPermissionsOption as boolean;
      }
      return false;
    });
  }
  public getPermissions(): ResultAsync<EWalletDataType[], MobileStorageError> {
    return ResultAsync.fromPromise(
      AsyncStorage.getItem("walletDataTypes"),
      (e) => new MobileStorageError("could not read key defaultFlags"),
    ).map((perms) => {
      if (perms) {
        return JSON.parse(perms);
      } else {
        AsyncStorage.setItem(
          "walletDataTypes",
          JSON.stringify([
            EWalletDataType.Gender,
            EWalletDataType.Birthday,
            EWalletDataType.Location,
            EWalletDataType.SiteVisits,
            EWalletDataType.EVMTransactions,
            EWalletDataType.AccountBalances,
            EWalletDataType.AccountNFTs,
          ]),
        );
        return [
          (EWalletDataType.Gender,
          EWalletDataType.Birthday,
          EWalletDataType.Location,
          EWalletDataType.SiteVisits,
          EWalletDataType.EVMTransactions,
          EWalletDataType.AccountBalances,
          EWalletDataType.AccountNFTs),
        ];
      }
    });
  }
  public setPermissions(
    walletDataTypes: EWalletDataType[],
  ): ResultAsync<void, MobileStorageError> {
    AsyncStorage.setItem("walletDataTypes", JSON.stringify(walletDataTypes));
    return okAsync(undefined);
  }

  public setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<void, MobileStorageError> {
    return ResultAsync.fromPromise(
      AsyncStorage.setItem(
        "applyDefaultPermissionsOption",
        JSON.stringify({
          applyDefaultPermissionsOption: option,
        }),
      ),
      (e) =>
        new MobileStorageError(
          "could not set value of applyDefaultPermissionsOption",
        ),
    );
  }

  public get DefaultDataPermissions(): ResultAsync<
    DataPermissions,
    MobileStorageError
  > {
    return this.defaultFlags.andThen((flags) => {
      return okAsync(new DataPermissions(flags));
    });
  }

  public setDefaultFlagsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, MobileStorageError> {
    return this.generateDataPermissionsClassWithDataTypes(dataTypes).andThen(
      (permissionsClass) => {
        return this.setDefaultFlags(permissionsClass.getFlags());
      },
    );
  }

  public setDefaultFlagsToAll(): ResultAsync<void, MobileStorageError> {
    return this.setDefaultFlags(DataPermissions.allPermissionsHexString);
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
  ): ResultAsync<void, MobileStorageError> {
    return ResultAsync.fromPromise(
      AsyncStorage.setItem(
        "defaultFlags",
        JSON.stringify({
          defaultFlags: flag,
        }),
      ),
      (e) => new MobileStorageError("could not set value of defaultFlags"),
    );
  }
}
