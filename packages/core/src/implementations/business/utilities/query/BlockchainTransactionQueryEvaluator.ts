import {
  ITimeUtilsType,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMAccountAddress,
  TransactionFilter,
  PersistenceError,
  SDQL_Return,
  UnixTimestamp,
  ISO8601DateString,
  BlockchainInteractionInsight,
  ETimePeriods,
  ChainTransaction,
} from "@snickerdoodlelabs/objects";
import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBlockchainTransactionQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import {
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class BlockchainTransactionQueryEvaluator
  implements IBlockchainTransactionQueryEvaluator
{
  constructor(
    @inject(ITransactionHistoryRepositoryType)
    protected transactionHistoryRepo: ITransactionHistoryRepository,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public eval(
    query: AST_BlockchainTransactionQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    // Aggregate Transactions
    if (query.type === "chain_transactions") {
      return this.transactionHistoryRepo
        .getTransactionByChain()
        .andThen((transactionsArray) => {
          return okAsync(SDQL_Return(transactionsArray));
        });
    }

    // Transactions related to a specific address, e.g. Dapp Query
    if (query.contract && query.chain) {
      const chainId = query.contract.networkId;
      const address = query.contract.address as EVMAccountAddress;
      const startTime = query.contract.timestampRange.start;
      const endTime = query.contract.timestampRange.end;
      const filter = new TransactionFilter(
        [chainId],
        [address],
        undefined,
        startTime,
        endTime,
      );

      if (query.returnType == "object") {
        return this.transactionHistoryRepo
          .getTransactions(filter)
          .map((transactions) => {
            if (transactions === null || transactions.length === 0) {
              return SDQL_Return(
                new BlockchainInteractionInsight(chainId, address, false),
              );
            }
            const latestTransaction = this.getLatestTransaction(transactions);
            const timePeriod = this.determineTimePeriod(
              latestTransaction.timestamp,
            );
            return SDQL_Return(
              new BlockchainInteractionInsight(
                chainId,
                address,
                true,
                timePeriod,
                latestTransaction.measurementDate,
              ),
            );
          });
      } else if (query.returnType == "boolean") {
        return this.transactionHistoryRepo
          .getTransactions(filter)
          .map((transactions) => {
            if (transactions == null) {
              return SDQL_Return(false);
            }
            if (transactions.length == 0) {
              return SDQL_Return(false);
            }
            return SDQL_Return(true);
          });
      }
    }
    return okAsync(SDQL_Return(false));
  }

  protected getLatestTransaction(
    transactions: ChainTransaction[],
  ): ChainTransaction {
    return transactions.reduce((latest, current) => {
      return current.timestamp > latest.timestamp ? current : latest;
    });
  }

  protected determineTimePeriod(transactionTime: number): ETimePeriods {
    const currentTime = this.timeUtils.getUnixNow();
    const transactionTimeInMs = transactionTime * 1000;

    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;

    const elapsedTime = currentTime - transactionTimeInMs;

    if (elapsedTime < dayInMs) {
      return ETimePeriods.Day;
    } else if (elapsedTime < weekInMs) {
      return ETimePeriods.Week;
    } else if (elapsedTime < monthInMs) {
      return ETimePeriods.Month;
    } else {
      return ETimePeriods.Year;
    }
  }
}
