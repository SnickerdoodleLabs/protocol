import { IAccountCookieUtils } from "@interfaces/utilities";
import { IUnlockParams } from "@shared/interfaces/actions";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import { ExtensionCookieError } from "@shared/objects/errors";
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
import Browser from "webextension-polyfill";

// Browser  Maximum size per cookie
// Chrome		4096 bytes
// Firefox	4097 bytes
// Opera	  4096 bytes

const MAXIMUM_ACCOUNT_COUNT = 15;

enum ECookieName {
  AccountInfo = "account-info",
  DataWalletAddress = "data-wallet-address",
}

@injectable()
export class AccountCookieUtils implements IAccountCookieUtils {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public writeDataWalletAddressToCookie(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, ExtensionCookieError> {
    return this._setCookie(ECookieName.DataWalletAddress, dataWalletAddress);
  }

  public readDataWalletAddressFromCookie(): ResultAsync<
    DataWalletAddress | null,
    ExtensionCookieError
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
    ExtensionCookieError
  > {
    return this._setCookie(ECookieName.DataWalletAddress, "");
  }

  public writeAccountInfoToCookie(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, ExtensionCookieError> {
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
        new ExtensionCookieError(
          "Not able to add account info to cookie, maxium capacity has been reached!",
        ),
      );
    });
  }

  public readAccountInfoFromCookie(): ResultAsync<
    IUnlockParams[],
    ExtensionCookieError
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
  ): ResultAsync<void, ExtensionCookieError> {
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
    date.setFullYear(
      date.getFullYear() + this.configProvider.getConfig().cookieLifeTime,
    );
    return UnixTimestamp(date.getTime() / 1000);
  }

  private _setCookie(
    name: ECookieName,
    value: string,
  ): ResultAsync<void, ExtensionCookieError> {
    if (!Browser.cookies) {
      return errAsync(
        new ExtensionCookieError("Cookie Permissions not granted"),
      );
    }
    return ResultAsync.fromPromise(
      Browser.cookies.set({
        url: this.configProvider.getConfig().accountCookieUrl,
        expirationDate: this._generateExpirationDate(),
        name,
        value,
        httpOnly: true,
      }),
      (e) => new ExtensionCookieError("Unable to set cookie"),
    ).map(() => {});
  }

  private _getCookie(
    name: ECookieName,
  ): ResultAsync<Browser.Cookies.Cookie, ExtensionCookieError> {
    if (!Browser.cookies) {
      return errAsync(
        new ExtensionCookieError("Cookie Permissions not granted"),
      );
    }
    return ResultAsync.fromPromise(
      Browser.cookies.get({
        name,
        url: this.configProvider.getConfig().accountCookieUrl,
      }),
      (e) => new ExtensionCookieError("Unable to get cookie"),
    );
  }
}
