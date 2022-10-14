import {
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
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
  InvalidParametersError,
  IChainTransaction,
  LinkedAccount,
  EChain,
  MinimalForwarderContractError,
  AccountAddress,
  DataWalletAddress,
  CeramicStreamID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAccountService {
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | MinimalForwarderContractError
  >;

  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | MinimalForwarderContractError
  >;

  unlinkAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | InvalidParametersError
    | BlockchainProviderError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
  >;

  getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
  >;

  getAccounts(): ResultAsync<LinkedAccount[], PersistenceError>;

  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError>;

  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError>;
  getTranactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError>;

  // getTransactionsArray(): ResultAsync<{ chainId: ChainId; items: EVMTransaction[] | null }[], PersistenceError>
  getTransactionsArray(): ResultAsync<IChainTransaction[], PersistenceError>

  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError>;

  postBackup(): ResultAsync<CeramicStreamID, PersistenceError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
