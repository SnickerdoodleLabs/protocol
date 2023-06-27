import {
  EVMAccountAddress,
  TransactionFilter,
  PersistenceError,
  SDQL_Return,
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
  ) {}

  public eval(
    query: AST_BlockchainTransactionQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    const result = SDQL_Return(false);
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
        .andThen((transactions) => {
          // console.log("network query Result: ", transactions)
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
        });
    } else if (query.returnType == "boolean") {
      return this.transactionHistoryRepo
        .getTransactions(filter)
        .andThen((transactions) => {
          // console.log("network Result: ", transactions);
          if (transactions == null) {
            return okAsync(SDQL_Return(false));
          }
          if (transactions.length == 0) {
            return okAsync(SDQL_Return(false));
          }

          return okAsync(SDQL_Return(true));
        });
    }

    if (query.name == "chain_transactions") {
      return this.transactionHistoryRepo
        .getTransactionValueByChain()
        .andThen((transactionsArray) => {
          // console.log("URL count: ", url_visited_count);
          return okAsync(SDQL_Return(transactionsArray));
        });
    }

    return okAsync(SDQL_Return(false));
  }
}
