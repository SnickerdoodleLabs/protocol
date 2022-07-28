import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  CrumbsContractError,
  EVMAccountAddress,
  InvalidSignatureError,
  IEVMBalance,
  IEVMNFT,
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
    | UninitializedError
    | CrumbsContractError
    | PersistenceError
    | UnsupportedLanguageError
    | InvalidSignatureError
    | AjaxError
    | ConsentContractError
  >;

  addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | CrumbsContractError
    | AjaxError
  >;

  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError>;

  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError>;

  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
