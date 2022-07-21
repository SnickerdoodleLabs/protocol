import {
  EVMAccountAddress,
  Signature,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IUnlockParams } from "@shared/interfaces/actions";
import { ExtensionCookieError } from "@shared/objects/errors";

export interface IAccountCookieUtils {
  writeAccountInfoToCookie(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, ExtensionCookieError>;

  readAccountInfoFromCookie(): ResultAsync<
    IUnlockParams[],
    ExtensionCookieError
  >;
}
