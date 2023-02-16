import {
  Signature,
  LanguageCode,
  AccountAddress,
  EChain,
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { MobileCookieError } from "../objects/errors/MobileCookieError";
import { IUnlockParams } from "../objects/params/IParams";

export interface IAccountCookieUtils {
  writeAccountInfoToCookie(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, MobileCookieError>;

  removeAccountInfoFromCookie(
    accountAddress: AccountAddress,
  ): ResultAsync<void, MobileCookieError>;

  readAccountInfoFromCookie(): ResultAsync<IUnlockParams[], MobileCookieError>;
  writeDataWalletAddressToCookie(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, MobileCookieError>;
  readDataWalletAddressFromCookie(): ResultAsync<
    DataWalletAddress | null,
    MobileCookieError
  >;
  removeDataWalletAddressFromCookie(): ResultAsync<void, MobileCookieError>;
}

export const IAccountCookieUtilsType = Symbol.for("IAccountCookieUtils");
