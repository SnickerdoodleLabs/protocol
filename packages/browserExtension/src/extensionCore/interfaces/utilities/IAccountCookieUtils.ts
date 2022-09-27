import {
  Signature,
  LanguageCode,
  AccountAddress,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IUnlockParams } from "@shared/interfaces/actions";
import { ExtensionCookieError } from "@shared/objects/errors";

export interface IAccountCookieUtils {
  writeAccountInfoToCookie(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, ExtensionCookieError>;

  removeAccountInfoFromCookie(
    accountAddress: AccountAddress,
  ): ResultAsync<void, ExtensionCookieError>;

  readAccountInfoFromCookie(): ResultAsync<
    IUnlockParams[],
    ExtensionCookieError
  >;

  hasCapacity: ResultAsync<boolean, ExtensionCookieError>;
}

export const IAccountCookieUtilsType = Symbol.for("IAccountCookieUtils");
