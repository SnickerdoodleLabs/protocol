import {
  PersistenceError,
  EChain,
  AccountAddress,
  ChainTransaction,
  TransactionFilter,
  TransactionFlowInsight,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITransactionHistoryRepository {
  getTransactionByChain(): ResultAsync<
    TransactionFlowInsight[],
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
('{"chainId":137,"address":"0xeeafbc6271834926f016c08318d28258ca63b931","interacted":true,"timePeriods":"Year","measurementTime":"2023-09-26T21:11:32.621Z"}');
