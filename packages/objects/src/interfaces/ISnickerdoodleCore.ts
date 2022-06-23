import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

import { SDQLQuery } from "@objects/businessObjects";
import {
  BlockchainProviderError,
  ConsentError,
  InvalidSignatureError,
  PersistenceError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@objects/errors";
import {
  DataWalletAddress,
  EthereumAccountAddress,
  IpfsCID,
  LanguageCode,
  Signature,
} from "@objects/primatives";

export interface ISnickerdoodleCore {
  /** getUnlockMessage() returns a localized string for the requested LanguageCode.
   * The Form Factor must have this string signed by the user's key (via Metamask,
   * wallet connect, etc), in order to call unlock() or addAccount();
   */
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  /**
   * unlock() serves a very important task as it both initializes the Query Engine
   * and establishes the actual address of the data wallet. After getUnlockMessage(),
   * this should be the second method you call on the Snickerdoodle Core. If this is the first
   * time using this account + unlock message, the Data Wallet will be created.
   * If this is a subsequent time, you will regain access to the exisitng wallet.
   * For an existing wallet with multiple connected accounts, you can unlock with a
   * signature from any of the accounts (form factor can decide), but you cannot
   * add a new account via unlock, use addAccount() to link a new account once you
   * have already logged in. It will return an error if you call it twice.
   * @param signature
   * @param countryCode
   */
  unlock(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
  >;

  /**
   * addAccount() adds an additional account to the data wallet. It is almost
   * identical to logging in, but the Snickerdoodle Core must be initialized first (with an
   * existing account). A connected account will be monitored for activity, and
   * can be used for subsequent logins. This can prevent you from being locked out
   * of your data wallet, as long as you have at least 2 accounts connected.
   * @param accountAddress
   * @param signature
   * @param countryCode
   */
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
    | PersistenceError
  >;

  addData(): ResultAsync<void, UninitializedError>;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentError>;

  getEvents(): ResultAsync<IQueryEngineEvents, never>;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");

export interface IQueryEngineEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQuery>;
  onAccountAdded: Observable<EthereumAccountAddress>;
}
