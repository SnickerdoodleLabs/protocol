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
  EVMTransactionFilter,
  EVMTransaction,
  ChainId,
  URLString,
  SiteVisit,
  MetatransactionSignatureRequest,
  InvalidParametersError,
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

  getUnlinkAccountRequest(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    MetatransactionSignatureRequest<PersistenceError | AjaxError>,
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidParametersError
  >;

  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError>;

  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError>;

  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError>;
  getTranactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError>;

  getTransactionsMap(): ResultAsync<Map<ChainId, number>, PersistenceError>;
  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
