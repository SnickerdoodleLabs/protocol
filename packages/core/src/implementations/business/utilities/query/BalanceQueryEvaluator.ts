import { MasterIndexer } from "@snickerdoodlelabs/indexers";
import {
  BigNumberString,
  ChainId,
  EQueryEvents,
  EStatus,
  EvalNotImplementedError,
  IpfsCID,
  PersistenceError,
  PublicEvents,
  QueryPerformanceEvent,
  SDQL_Return,
  TokenAddress,
  TokenBalance,
  TokenBalanceInsight,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { BigNumber, ethers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import {
  IPortfolioBalanceRepository,
  IPortfolioBalanceRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
  constructor(
    @inject(IPortfolioBalanceRepositoryType)
    protected balanceRepo: IPortfolioBalanceRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public eval(
    query: AST_BalanceQuery,
    queryCID: IpfsCID,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      context.publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(
          EQueryEvents.BalanceDataAccess,
          EStatus.Start,
          queryCID,
          query.name,
        ),
      );
      return this.balanceRepo
        .getAccountBalances()
        .andThen((balances) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.BalanceDataAccess,
              EStatus.End,
              queryCID,
              query.name,
            ),
          );
          if (query.networkId == null) {
            return okAsync(balances);
          }
          const networkBalances = balances.filter(
            (balance) => balance.chainId == query.networkId,
          );
          return okAsync(networkBalances);
        })
        .mapErr((err) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.BalanceDataAccess,
              EStatus.End,
              queryCID,
              query.name,
              err,
            ),
          );
          return err;
        })
        .andThen((balanceArray) => {
          return this.evalConditions(query, balanceArray);
        })
        .andThen((balanceArray) => {
          return this.combineContractValues(query, balanceArray);
        })
        .map((balanceArray) => {
          return SDQL_Return(
            this.getAccountBalancesWithoutOwnerAddress(balanceArray),
          );
        });
    });
  }

  public evalConditions(
    query: AST_BalanceQuery,
    balanceArray: TokenBalance[],
  ): ResultAsync<TokenBalance[], never> {
    for (const condition of query.conditions) {
      let val: BigNumber = BigNumber.from(0);

      switch (condition.constructor) {
        case ConditionGE:
          val = BigNumber.from((condition as ConditionGE).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).gte(val),
          );
          break;

        case ConditionG:
          val = BigNumber.from((condition as ConditionG).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).gt(val),
          );
          break;

        case ConditionL:
          val = BigNumber.from((condition as ConditionL).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).lt(val),
          );
          break;

        case ConditionE:
          val = BigNumber.from((condition as ConditionE).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).eq(val),
          );
          break;

        case ConditionLE:
          val = BigNumber.from((condition as ConditionLE).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).lte(val),
          );
          break;

        default:
          console.error("EvalNotImplementedError");
          throw new EvalNotImplementedError(
            `${condition.constructor.name} not implemented`,
          );
      }
    }
    return okAsync(balanceArray);
  }

  public combineContractValues(
    query: AST_BalanceQuery,
    balanceArray: TokenBalance[],
  ): ResultAsync<TokenBalance[], PersistenceError> {
    const balanceMap = new Map<`${ChainId}-${TokenAddress}`, TokenBalance>();

    const nonZeroBalanceArray = balanceArray.filter((item) => {
      const ethValue = ethers.BigNumber.from(item.balance);
      return !ethValue.eq(0);
    });

    nonZeroBalanceArray.forEach((d) => {
      const networkIdAndAddress: `${ChainId}-${TokenAddress}` = `${d.chainId}-${d.tokenAddress}`;
      const getObject = balanceMap.get(networkIdAndAddress);

      if (getObject) {
        balanceMap.set(
          networkIdAndAddress,
          new TokenBalance(
            getObject.type,
            getObject.ticker,
            getObject.chainId,
            getObject.tokenAddress || MasterIndexer.nativeAddress,
            getObject.accountAddress,
            BigNumberString(
              BigNumber.from(getObject.balance)
                .add(BigNumber.from(d.balance))
                .toString(),
            ),
            getObject.decimals,
          ),
        );
      } else {
        balanceMap.set(networkIdAndAddress, d);
      }
    });

    return okAsync(Array.from(balanceMap.values()));
  }

  protected getAccountBalancesWithoutOwnerAddress(
    tokenBalances: TokenBalance[],
  ): TokenBalanceInsight[] {
    return tokenBalances.map(
      ({ accountAddress, ...restOfBalance }) => restOfBalance,
    );
  }
}
