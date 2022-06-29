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

export interface IAccountService {
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
  >;

  addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
    | PersistenceError
  >;
}

export const IAccountServiceType = Symbol.for("IAccountService");
