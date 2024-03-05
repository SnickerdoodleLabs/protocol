import {
  EarnedReward,
  InvalidSignatureError,
  TokenBalance,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
  TransactionFilter,
  ChainId,
  SiteVisit,
  InvalidParametersError,
  ChainTransaction,
  LinkedAccount,
  EChain,
  AccountAddress,
  TokenAddress,
  UnixTimestamp,
  DataWalletBackupID,
  DomainName,
  UnauthorizedError,
  AccountIndexingError,
  SiteVisitsMap,
  TransactionFlowInsight,
  AjaxError,
  MethodSupportError,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IAccountService {
  getLinkAccountMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  initialize(): ResultAsync<void, PersistenceError>;

  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  >;

  addAccountWithExternalSignature(
    accountAddress: AccountAddress,
    message: string,
    signature: Signature,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  >;

  addAccountWithExternalTypedDataSignature(
    accountAddress: AccountAddress,
    domain: ethers.TypedDataDomain,
    types: Record<string, Array<ethers.TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | InvalidParametersError
  >;

  unlinkAccount(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | InvalidParametersError
  >;

  getAccounts(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], UnauthorizedError | PersistenceError>;

  getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError>;

  getNfts(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;

  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError>;

  getTransactionValueByChain(): ResultAsync<
    TransactionFlowInsight[],
    PersistenceError
  >;

  getSiteVisitsMap(): ResultAsync<SiteVisitsMap, PersistenceError>;
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
    address: TokenAddress,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
