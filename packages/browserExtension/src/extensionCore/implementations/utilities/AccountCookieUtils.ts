import {
  EVMAccountAddress,
  Signature,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import Browser from "webextension-polyfill";
import { IUnlockParams } from "@shared/objects/EventParams";
import { IAccountCookieUtils } from "@interfaces/utilities";
import { ExtensionCookieError } from "@shared/objects/errors";
export class AccountCookieUtils implements IAccountCookieUtils {
  writeAccountInfoToCookie(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, ExtensionCookieError> {
    const _value = { account, signature, languageCode };
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this._getAccountCookie().andThen((cookie) => {
      let value = JSON.stringify([_value]);
      if (cookie?.value) {
        value = JSON.stringify(
          Array.from(new Set([...JSON.parse(cookie.value), _value])),
        );
      }
      if (!Browser.cookies) {
        return errAsync(
          new ExtensionCookieError("Cookie Permissions not granted"),
        );
      }
      return ResultAsync.fromPromise(
        Browser.cookies.set({
          // TODO add onboarding url once its published
          url: "https://snickerdoodlelabs.io/",
          expirationDate: date.getTime() / 1000,
          name: "account-info",
          value,
          httpOnly: true,
        }),
        (e) => new ExtensionCookieError("Unable to set cookie"),
      );
    });
    return okAsync(undefined);
  }

  readAccountInfoFromCookie(): ResultAsync<
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
        url: "https://snickerdoodlelabs.io/",
      }),
      (e) => new ExtensionCookieError("Unable to get cookie"),
    );
  }
}
