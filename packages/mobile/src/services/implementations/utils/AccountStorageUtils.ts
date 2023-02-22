import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager, { Cookie, Cookies } from "@react-native-cookies/cookies";
import {
  UnixTimestamp,
  Signature,
  LanguageCode,
  EChain,
  AccountAddress,
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { MobileCookieError } from "../../interfaces/objects/errors/MobileCookieError";
import { IUnlockParams } from "../../interfaces/objects/params/IParams";
import { IAccountStorageUtils } from "../../interfaces/utils/IAccountStorageUtils";

export enum ECookieName {
  AccountInfo = "dw-account-info",
  DataWalletAddress = "dw-address",
}

@injectable()
export class AccountStorageUtils implements IAccountStorageUtils {
  constructor() {}
  public writeAccountInfoToStorage(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, MobileCookieError> {
    return this.readAccountInfoStorage().andThen((accountInfoArr) => {
      const _value = { accountAddress, signature, languageCode, chain };
      if (
        accountInfoArr
          .map((o) => JSON.stringify(o))
          .includes(JSON.stringify(_value))
      ) {
        return okAsync(undefined);
      }
      const value = JSON.stringify([...accountInfoArr, _value]);
      return this._setValue("dw-account-info", value);
    });
  }
  public removeAccountInfoStorage(
    accountAddress: AccountAddress,
  ): ResultAsync<void, MobileCookieError> {
    return this.readAccountInfoStorage().andThen((acountInfoArr) => {
      return this._setValue(
        "dw-account-info",
        JSON.stringify(
          acountInfoArr.filter(
            (accountInfo) => accountInfo.accountAddress != accountAddress,
          ),
        ),
      );
    });
  }
  public readAccountInfoStorage(): ResultAsync<
    IUnlockParams[],
    MobileCookieError
  > {
    return this._getValue("dw-account-info").andThen((accounts) => {
      if (!accounts) {
        return okAsync([]);
      } else {
        return okAsync(JSON.parse(accounts) as IUnlockParams[]);
      }
    });
  }
  public writeDataWalletAddressToStorage(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, MobileCookieError> {
    return this._setValue("dw-address", dataWalletAddress);
  }
  public readDataWalletAddressFromstorage(): ResultAsync<
    DataWalletAddress | null,
    MobileCookieError
  > {
    return this._getValue("dw-address").map((val) =>
      val ? (val as DataWalletAddress) : null,
    );
  }
  public removeDataWalletAddressFromstorage(): ResultAsync<
    void,
    MobileCookieError
  > {
    return this._setValue("dw-address", "");
  }

  private _setValue = (
    key: string,
    value: string,
  ): ResultAsync<void, MobileCookieError> => {
    return ResultAsync.fromPromise(
      AsyncStorage.setItem(key, value),
      (e) => new MobileCookieError(),
    );
  };

  private _getValue = (
    key: string,
  ): ResultAsync<string | null, MobileCookieError> => {
    return ResultAsync.fromPromise(
      AsyncStorage.getItem(key),
      (e) => new MobileCookieError(),
    );
  };
}
