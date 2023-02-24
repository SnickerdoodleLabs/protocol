import {
  TransactionPaymentCounter,
  PersistenceError,
  ChainId,
  AccountAddress,
  ChainTransaction,
  TransactionFilter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITransactionHistoryRepository {
  getTransactionValueByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  >;
  getLatestTransactionForAccount(
    chainId: ChainId,
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
