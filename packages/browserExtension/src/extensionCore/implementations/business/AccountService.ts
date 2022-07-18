import { IAccountService } from "@interfaces/business";
import { IAccountRepository } from "@interfaces/data";
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
export class AccountService implements IAccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public addAccount(
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
  > {
    return this.accountRepository.addAccount(account, signature, languageCode);
  }

  public unlock(
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
  > {
    return this.accountRepository.unlock(
      account,
      signature,
      languageCode,
      calledWithCookie || false,
    );
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    return this.accountRepository.getUnlockMessage(languageCode);
  }
}
