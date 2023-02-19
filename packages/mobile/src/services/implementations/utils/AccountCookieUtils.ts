import { UnixTimestamp } from "@snickerdoodlelabs/objects";
import {
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
import { IAccountCookieUtils } from "../../interfaces/utils/IAccountCookieUtils";
import CookieManager, { Cookie, Cookies } from "@react-native-cookies/cookies";

const MAXIMUM_ACCOUNT_COUNT = 15;

enum ECookieName {
  AccountInfo = "account-info",
  DataWalletAddress = "data-wallet-address",
}

@injectable()
export class AccountCookieUtils implements IAccountCookieUtils {
  constructor() {}

  public writeDataWalletAddressToCookie(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, MobileCookieError> {
    return this._setCookie(ECookieName.DataWalletAddress, dataWalletAddress);
  }

  public readDataWalletAddressFromCookie(): ResultAsync<
    DataWalletAddress | null,
    MobileCookieError
  > {
    return this._getCookie(ECookieName.DataWalletAddress).andThen((cookie) => {
      if (!cookie?.value) {
        return okAsync(null);
      }
      return okAsync(cookie.value as DataWalletAddress);
    });
  }

  public removeDataWalletAddressFromCookie(): ResultAsync<
    void,
    MobileCookieError
  > {
    return this._setCookie(ECookieName.DataWalletAddress, "");
  }

  public writeAccountInfoToCookie(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, MobileCookieError> {
    return this.readAccountInfoFromCookie().andThen((accountInfo) => {
      const _value = { accountAddress, signature, languageCode, chain };
      if (
        accountInfo
          .map((o) => JSON.stringify(o))
          .includes(JSON.stringify(_value))
      ) {
        return okAsync(undefined);
      }
      if (accountInfo.length < MAXIMUM_ACCOUNT_COUNT) {
        const value = JSON.stringify([...accountInfo, _value]);
        return this._setCookie(ECookieName.AccountInfo, value);
      }
      // TODO generate new key to store more account information
      // instead returning an error
      return errAsync(
        new MobileCookieError(
          "Not able to add account info to cookie, maxium capacity has been reached!",
        ),
      );
    });
  }

  public readAccountInfoFromCookie(): ResultAsync<
    IUnlockParams[],
    MobileCookieError
  > {
    return this._getCookie(ECookieName.AccountInfo).andThen((cookie) => {
      if (!cookie?.value) {
        return okAsync([]);
      }
      return okAsync(JSON.parse(cookie.value) as IUnlockParams[]);
    });
  }

  public removeAccountInfoFromCookie(
    accountAddress: AccountAddress,
  ): ResultAsync<void, MobileCookieError> {
    return this.readAccountInfoFromCookie().andThen((acountInfoArr) => {
      return this._setCookie(
        ECookieName.AccountInfo,
        JSON.stringify(
          acountInfoArr.filter(
            (accountInfo) => accountInfo.accountAddress != accountAddress,
          ),
        ),
      );
    });
  }

  private _generateExpirationDate(): UnixTimestamp {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return UnixTimestamp(date.getTime() / 1000);
  }

  private _setCookie(
    name: ECookieName,
    value: string,
  ): ResultAsync<void, MobileCookieError> {
    return ResultAsync.fromPromise(
      CookieManager.set("https://snickerdoodlelabs.io", {
        name,
        value,
        expires: `${this._generateExpirationDate()}`,
        httpOnly: true,
      }),
      (e) => new MobileCookieError("Unable to set cookie", e),
    ).map(() => {});
  }

  private _getCookie(name: ECookieName): ResultAsync<any, MobileCookieError> {
    return ResultAsync.fromPromise(
      CookieManager.get("https://snickerdoodlelabs.io").then((cookies) => {
        return cookies[name];
      }),
      () => new MobileCookieError("Unable to get cookie"),
    );
  }
}
