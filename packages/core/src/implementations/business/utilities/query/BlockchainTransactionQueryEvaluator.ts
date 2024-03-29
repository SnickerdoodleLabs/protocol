import { ITimeUtilsType, ITimeUtils } from "@snickerdoodlelabs/common-utils";
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
  PublicEvents,
  QueryPerformanceEvent,
  EQueryEvents,
  IpfsCID,
  EStatus,
} from "@snickerdoodlelabs/objects";
import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBlockchainTransactionQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import {
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class BlockchainTransactionQueryEvaluator
  implements IBlockchainTransactionQueryEvaluator
{
  constructor(
    @inject(ITransactionHistoryRepositoryType)
    protected transactionHistoryRepo: ITransactionHistoryRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public eval(
    query: AST_BlockchainTransactionQuery,
    queryCID: IpfsCID,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      // Aggregate Transactions
      if (query.type === "chain_transactions") {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionDataAccess,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.transactionHistoryRepo
          .getTransactionByChain(queryTimestamp)
          .andThen((transactionsArray) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            return okAsync(SDQL_Return(transactionsArray));
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err,
              ),
            );
            return err;
          });
      }

      // Transactions related to a specific address, e.g. Dapp Query
      if (query.contract != null && query.chain != null) {
        const chainId = query.contract.networkId;
        const address = EVMAccountAddress(query.contract.address);
        const startTime = query.contract.timestampRange.start;
        const endTime = query.contract.timestampRange.end;
        const filter = new TransactionFilter(
          [chainId],
          [address],
          undefined,
          startTime,
          endTime,
        );
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.TransactionDataAccess,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.transactionHistoryRepo
          .getTransactions(filter)
          .map((transactions) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.TransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            if (query.returnType == "object") {
              if (transactions === null || transactions.length === 0) {
                return SDQL_Return(
                  new BlockchainInteractionInsight(chainId, address, false),
                );
              }
              const latestTransaction = this.getLatestTransaction(transactions);
              const timePeriod =
                this.transactionHistoryRepo.determineTimePeriod(
                  latestTransaction.timestamp,
                  queryTimestamp,
                );
              if (timePeriod === null) {
                return SDQL_Return(
                  new BlockchainInteractionInsight(chainId, address, false),
                );
              }
              return SDQL_Return(
                new BlockchainInteractionInsight(
                  chainId,
                  address,
                  true,
                  timePeriod,
                  latestTransaction.measurementDate,
                ),
              );
            } else if (query.returnType == "boolean") {
              if (transactions === null || transactions.length === 0) {
                return SDQL_Return(false);
              }
              return SDQL_Return(true);
            }
            return SDQL_Return(false);
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.TransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err,
              ),
            );
            return err;
          });
      }
      return okAsync(SDQL_Return(false));
    });
  }

  protected getLatestTransaction(
    transactions: ChainTransaction[],
  ): ChainTransaction {
    return transactions.reduce((latest, current) => {
      return current.timestamp > latest.timestamp ? current : latest;
    });
  }
}
