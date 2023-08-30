import {
  TransactionPaymentCounter,
  PersistenceError,
  EChain,
  AccountAddress,
  ChainTransaction,
  TransactionFilter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITransactionHistoryRepository {
  getTransactionByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  >;
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
