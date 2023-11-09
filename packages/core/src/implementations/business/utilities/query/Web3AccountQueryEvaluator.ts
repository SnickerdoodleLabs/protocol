import {
  PersistenceError,
  SDQL_Return,
  QueryPerformanceEvent,
  EQueryEvents,
  IpfsCID,
  EStatus,
  Web3AccountInsight,
} from "@snickerdoodlelabs/objects";
import { AST_Web3AccountSizeQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IWeb3AccountQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import {
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class Web3AccountQueryEvaluator implements IWeb3AccountQueryEvaluator {
  constructor(
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}
  eval(
    query: AST_Web3AccountSizeQuery,
    queryCID: IpfsCID,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      context.publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(
          EQueryEvents.Web3AccountDataAccess,
          EStatus.Start,
          queryCID,
          query.name,
        ),
      );
      return this.accountRepo
        .getAccounts()
        .map((accounts) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.Web3AccountDataAccess,
              EStatus.End,
              queryCID,
              query.name,
            ),
          );
          const accountSize = accounts.length;
          return SDQL_Return(new Web3AccountInsight(accountSize));
        })
        .mapErr((err) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.Web3AccountDataAccess,
              EStatus.End,
              queryCID,
              query.name,
              err,
            ),
          );
          return err;
        });
    });
  }
}
