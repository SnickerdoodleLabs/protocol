import {
  EarnedReward,
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  TokenBalance,
  WalletNFT,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
  TransactionFilter,
  ChainId,
  URLString,
  SiteVisit,
  InvalidParametersError,
  ChainTransaction,
  LinkedAccount,
  EChain,
  MinimalForwarderContractError,
  AccountAddress,
  DataWalletAddress,
  TokenAddress,
  UnixTimestamp,
  DataWalletBackupID,
  TransactionPaymentCounter,
  DomainName,
  UnauthorizedError,
  AccountIndexingError,
  PasswordString,
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

  unlockWithPassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | MinimalForwarderContractError
  >;

  addPassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | MinimalForwarderContractError
  >;

  removePassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
  >;

  getAccounts(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], UnauthorizedError | PersistenceError>;

  getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError>;

  getAccountNFTs(): ResultAsync<WalletNFT[], PersistenceError>;
  getTranactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError>;

  getTransactionValueByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  >;

  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError>;

  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError>;
  addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError>;

  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
