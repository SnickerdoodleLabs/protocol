import { EarnedReward } from "@snickerdoodlelabs/objects";
import {
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  ITokenBalance,
  IAccountNFT,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
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
  TransactionFilter,
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

  getAccountBalances(): ResultAsync<ITokenBalance[], PersistenceError>;

  getAccountNFTs(): ResultAsync<IAccountNFT[], PersistenceError>;
  getTranactions(
    filter?: TransactionFilter,
  ): ResultAsync<IChainTransaction[], PersistenceError>;

  getTransactionsArray(): ResultAsync<IChainTransaction[], PersistenceError>
  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  addTransactions(
    transactions: IChainTransaction[],
  ): ResultAsync<void, PersistenceError>;

  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError>;
  addEarnedReward(reward: EarnedReward): ResultAsync<void, PersistenceError>;

  postBackup(): ResultAsync<CeramicStreamID, PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
