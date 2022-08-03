import { SnickerDoodleCoreError, ExtensionCookieError } from "@shared/objects/errors";
import {
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";

export interface IAccountService {
  addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError>;
  getUnlockMessage(languageCode: LanguageCode): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(): ResultAsync<EVMAccountAddress[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<IEVMBalance[], SnickerDoodleCoreError>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], SnickerDoodleCoreError>;
}
