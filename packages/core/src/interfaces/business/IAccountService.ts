import {
  BlockchainProviderError,
  EthereumAccountAddress,
  InvalidSignatureError,
  LanguageCode,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAccountService {
  getLoginMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  >;

  addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
  >;
}

export const IAccountServiceType = Symbol.for("IAccountService");
