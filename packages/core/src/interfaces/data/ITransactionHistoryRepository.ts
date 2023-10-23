import {
  PersistenceError,
  EChain,
  AccountAddress,
  ChainTransaction,
  TransactionFilter,
  TransactionFlowInsight,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITransactionHistoryRepository {
  getTransactionByChain(
    benchmarkTimestamp?: UnixTimestamp,
  ): ResultAsync<TransactionFlowInsight[], PersistenceError>;
  getLatestTransactionForAccount(
    chain: EChain,
    address: AccountAddress,
  ): ResultAsync<ChainTransaction | null, PersistenceError>;
  addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError>;
  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError>;
}

export const ITransactionHistoryRepositoryType = Symbol.for(
  "ITransactionHistoryRepository",
);
