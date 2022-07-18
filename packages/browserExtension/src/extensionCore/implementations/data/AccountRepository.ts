import { IAccountRepository } from "@interfaces/data";
import { IAccountCookieUtils } from "@interfaces/utilities";
import { ExtensionCookieError } from "@shared/objects/errors";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  CrumbsContractError,
  EVMAccountAddress,
  InvalidSignatureError,
  ISnickerdoodleCore,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";

import { okAsync, ResultAsync } from "neverthrow";
export class AccountRepository implements IAccountRepository {
  constructor(
    protected core: ISnickerdoodleCore,
    protected accountCookieUtils: IAccountCookieUtils,
  ) {}

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
    return this.core
      .addAccount(account, signature, languageCode)
      .andThen(() => {
        return this.accountCookieUtils.writeAccountInfoToCookie(
          account,
          signature,
          languageCode,
        );
      });
  }

  public unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    calledWithCookie: boolean,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | PersistenceError
    | UnsupportedLanguageError
    | InvalidSignatureError
    | AjaxError
    | ConsentContractError
    | ExtensionCookieError
  > {
    return this.core.unlock(account, signature, languageCode).andThen(() => {
      if (calledWithCookie) {
        return okAsync(undefined);
      }
      return this.accountCookieUtils.writeAccountInfoToCookie(
        account,
        signature,
        languageCode,
      );
    });
  }
  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    return this.core.getUnlockMessage(languageCode);
  }
}
