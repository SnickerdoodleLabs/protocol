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
  NftRepositoryCache,
  EQueryProcessingStatus,
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

  getNfts(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;

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
    contractAddress?: EVMContractAddress,
    status?: EQueryProcessingStatus[],
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
