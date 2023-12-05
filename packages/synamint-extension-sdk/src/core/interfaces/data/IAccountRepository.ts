import {
  AccountAddress,
  EarnedReward,
  EChain,
  WalletNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenBalance,
  UnauthorizedError,
  IpfsCID,
  QueryStatus,
  EVMContractAddress,
  BlockNumber,
  TransactionFlowInsight,
  TransactionFilter,
  ChainTransaction,
  DomainName,
  WalletNftWithHistory,
  WalletNFTHistory,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IAccountRepository {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(
    sourceDomain?: DomainName,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;

  getCachedNFTs(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;
  getPersistenceNFTs(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;
  getNFTsHistory(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError>;
  getCachedNftsWithHistory(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNftWithHistory[], SnickerDoodleCoreError>;
  getNftsWithHistoryUsingBenchmark(
    benchmark: UnixTimestamp,
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNftWithHistory[], SnickerDoodleCoreError>;

  isDataWalletAddressInitialized(): ResultAsync<boolean, UnauthorizedError>;
  unlinkAccount(
    account: AccountAddress,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], SnickerDoodleCoreError>;
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError>;
  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], SnickerDoodleCoreError>;
  getTransactions(
    filter?: TransactionFilter,
    sourceDomain?: DomainName,
  ): ResultAsync<ChainTransaction[], SnickerDoodleCoreError>;
  getTransactionValueByChain(
    sourceDomain?: DomainName,
  ): ResultAsync<TransactionFlowInsight[], SnickerDoodleCoreError>;
}

export const IAccountRepositoryType = Symbol.for("IAccountRepository");
