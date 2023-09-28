import {
  EVMAccountAddress,
  TransactionFilter,
  PersistenceError,
  SDQL_Return,
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
    queryCID : IpfsCID
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
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
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionDataAccess,
            EStatus.Start,
            queryCID,
            query.name
          ),
        );
        return this.transactionHistoryRepo
          .getTransactions(filter)
          .andThen((transactions) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name
              ),
            );
            if (transactions == null) {
              return okAsync(
                SDQL_Return({
                  networkId: chainId,
                  address: address,
                  return: false,
                }),
              );
            }
            if (transactions.length == 0) {
              return okAsync(
                SDQL_Return({
                  networkId: chainId,
                  address: address,
                  return: false,
                }),
              );
            }

            return okAsync(
              SDQL_Return({
                networkId: chainId,
                address: address,
                return: true,
              }),
            );
          }).mapErr( (err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err
              ),
            );
            throw err
          });
      } else if (query.returnType == "boolean") {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionDataAccess,
            EStatus.Start,
            queryCID,
            query.name
          ),
        );
        return this.transactionHistoryRepo
          .getTransactions(filter)
          .andThen((transactions) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name
              ),
            );
            if (transactions == null) {
              return okAsync(SDQL_Return(false));
            }
            if (transactions.length == 0) {
              return okAsync(SDQL_Return(false));
            }

            return okAsync(SDQL_Return(true));
          }).mapErr( (err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err
              ),
            );
            throw err
          });
      }

      if (query.name == "chain_transactions") {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionDataAccess,
            EStatus.Start,
            queryCID,
            query.name
          ),
        );
        return this.transactionHistoryRepo
          .getTransactionByChain()
          .andThen((transactionsArray) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name
              ),
            );
            return okAsync(SDQL_Return(transactionsArray));
          }).mapErr( (err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err
              ),
            );
            throw err
          });
      }

      return okAsync(SDQL_Return(false));
    });
  }
}
