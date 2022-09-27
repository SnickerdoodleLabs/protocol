import {
  Signature,
  LanguageCode,
  EChain,
  AccountAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import Browser from "webextension-polyfill";

import { IAccountCookieUtils } from "@interfaces/utilities";
import { IUnlockParams } from "@shared/interfaces/actions";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import { ExtensionCookieError } from "@shared/objects/errors";

// Browser  Maximum size per cookie
// Chrome		4096 bytes
// Firefox	4097 bytes
// Opera	  4096 bytes

const MAXIMUM_ACCOUNT_COUNT = 15;

@injectable()
export class AccountCookieUtils implements IAccountCookieUtils {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public writeAccountInfoToCookie(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, ExtensionCookieError> {
    return this.readAccountInfoFromCookie().andThen((cookie) => {
      if (cookie.length < MAXIMUM_ACCOUNT_COUNT) {
        const _value = { accountAddress, signature, languageCode, chain };
        const value = JSON.stringify(Array.from(new Set([...cookie, _value])));
        return this._setAccountCookie(value);
      }
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
    return this._getAccountCookie().andThen((cookie) => {
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
      return this._setAccountCookie(
        JSON.stringify(
          acountInfoArr.filter(
            (accountInfo) => accountInfo.accountAddress != accountAddress,
          ),
        ),
      );
    });
  }

  private _setAccountCookie(
    value: string,
  ): ResultAsync<void, ExtensionCookieError> {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    if (!Browser.cookies) {
      return errAsync(
        new ExtensionCookieError("Cookie Permissions not granted"),
      );
    }
    return ResultAsync.fromPromise(
      Browser.cookies.set({
        // TODO add onboarding url once its published
        url: this.configProvider.getConfig().accountCookieUrl,
        expirationDate: date.getTime() / 1000,
        name: "account-info",
        value,
        httpOnly: true,
      }),
      (e) => new ExtensionCookieError("Unable to set cookie"),
    ).map(() => {});
  }

  private _getAccountCookie(): ResultAsync<
    Browser.Cookies.Cookie,
    ExtensionCookieError
  > {
    if (!Browser.cookies) {
      return errAsync(
        new ExtensionCookieError("Cookie Permissions not granted"),
      );
    }
    return ResultAsync.fromPromise(
      Browser.cookies.get({
        name: "account-info",
        // TODO add onboarding url once its published
        url: this.configProvider.getConfig().accountCookieUrl,
      }),
      (e) => new ExtensionCookieError("Unable to get cookie"),
    );
  }

  public get hasCapacity(): ResultAsync<boolean, ExtensionCookieError> {
    return this.readAccountInfoFromCookie().andThen((cookieItems) =>
      okAsync(cookieItems.length < MAXIMUM_ACCOUNT_COUNT),
    );
  }
}
