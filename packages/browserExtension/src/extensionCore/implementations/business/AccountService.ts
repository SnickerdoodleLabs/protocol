import { IAccountService } from "@interfaces/business";
import { IAccountRepository } from "@interfaces/data";
import {
  BlockchainProviderError,
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
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
    | PersistenceError
  > {
    return this.accountRepository.addAccount(account, signature, languageCode);
  }

  public unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
    | PersistenceError
  > {
    return this.accountRepository.addAccount(account, signature, languageCode);
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    return this.accountRepository.getUnlockMessage(languageCode);
  }
}
