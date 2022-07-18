import { ExtensionCookieError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  CrumbsContractError,
  EVMAccountAddress,
  InvalidSignatureError,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";

export interface IAccountService {
  addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | CrumbsContractError
    | AjaxError
    | ExtensionCookieError
  >;
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<
    void,
    | UnsupportedLanguageError
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | PersistenceError
    | InvalidSignatureError
    | AjaxError
    | CrumbsContractError
    | ExtensionCookieError
  >;
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;
}
