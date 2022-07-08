import { IAccountRepository } from "@interfaces/data";
import {
  BlockchainProviderError,
  EVMAccountAddress,
  InvalidSignatureError,
  ISnickerdoodleCore,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";
export class AccountRepository implements IAccountRepository {
  constructor(protected core: ISnickerdoodleCore) {}

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
    return this.core.addAccount(account, signature, languageCode);
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
    return this.core.unlock(account, signature, languageCode);
  }
  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    return this.core.getUnlockMessage(languageCode);
  }
}
