import {
  EChain,
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";

export interface IAccountService {
  addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
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

export const IAccountServiceType = Symbol.for("IAccountService");
