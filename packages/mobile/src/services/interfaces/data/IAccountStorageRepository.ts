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

export interface IAccountStorageRepository {
  writeAccountInfoToStorage(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, MobileCookieError>;

  removeAccountInfoStorage(
    accountAddress: AccountAddress,
  ): ResultAsync<void, MobileCookieError>;

  readAccountInfoStorage(): ResultAsync<IUnlockParams[], MobileCookieError>;
  writeDataWalletAddressToStorage(
    dataWalletAddress: DataWalletAddress,
  ): ResultAsync<void, MobileCookieError>;
  readDataWalletAddressFromstorage(): ResultAsync<
    DataWalletAddress | null,
    MobileCookieError
  >;
  removeDataWalletAddressFromstorage(): ResultAsync<void, MobileCookieError>;
}

export const IAccountStorageRepositoryType = Symbol.for("IAccountStorageRepository");
