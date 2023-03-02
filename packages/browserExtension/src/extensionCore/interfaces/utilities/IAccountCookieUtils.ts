import {
  Signature,
  LanguageCode,
  AccountAddress,
  EChain,
  DataWalletAddress,
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
  writeDataWalletAddressToCookie(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, ExtensionCookieError>;
  readDataWalletAddressFromCookie(): ResultAsync<
    DataWalletAddress | null,
    ExtensionCookieError
  >;
  removeDataWalletAddressFromCookie(): ResultAsync<void, ExtensionCookieError>;
}

export const IAccountCookieUtilsType = Symbol.for("IAccountCookieUtils");
