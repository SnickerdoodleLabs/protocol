import {
  AccountAddress,
  EChain,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ExtensionCookieError,
  SnickerDoodleCoreError,
} from "@shared/objects/errors";

export interface IAccountRepository {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  unlock(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError>;
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<IEVMBalance[], SnickerDoodleCoreError>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], SnickerDoodleCoreError>;
  isDataWalletAddressInitialized(): ResultAsync<boolean, never>;
  getUnlinkAccountRequest(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IAccountRepositoryType = Symbol.for("IAccountRepository");
