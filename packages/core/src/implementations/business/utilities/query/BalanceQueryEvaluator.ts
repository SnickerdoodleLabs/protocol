import {
  IBigNumberUtils,
  IBigNumberUtilsType,
} from "@snickerdoodlelabs/common-utils";
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
import { ethers } from "ethers";
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
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
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
      let val = BigInt(0);

      // TODO: the casts here for the conditions are just horrible!
      switch (condition.constructor) {
        case ConditionGE:
          val = BigInt((condition as ConditionGE).rval as number);
          balanceArray = balanceArray.filter(
            (balance) => this.bigNumberUtils.BNSToBN(balance.balance) >= val,
          );
          break;

        case ConditionG:
          val = BigInt((condition as ConditionG).rval as number);
          balanceArray = balanceArray.filter(
            (balance) => this.bigNumberUtils.BNSToBN(balance.balance) > val,
          );
          break;

        case ConditionL:
          val = BigInt((condition as ConditionL).rval as number);
          balanceArray = balanceArray.filter(
            (balance) => this.bigNumberUtils.BNSToBN(balance.balance) < val,
          );
          break;

        case ConditionE:
          val = BigInt((condition as ConditionE).rval as number);
          balanceArray = balanceArray.filter(
            (balance) => this.bigNumberUtils.BNSToBN(balance.balance) == val,
          );
          break;

        case ConditionLE:
          val = BigInt((condition as ConditionLE).rval as number);
          balanceArray = balanceArray.filter(
            (balance) => this.bigNumberUtils.BNSToBN(balance.balance) <= val,
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
      const ethValue = this.bigNumberUtils.BNSToBN(item.balance);
      return ethValue != 0n;
    });

    nonZeroBalanceArray.forEach((d) => {
      const networkIdAndAddress: `${ChainId}-${TokenAddress}` = `${
        d.chainId as ChainId
      }-${d.tokenAddress}`;
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
            this.bigNumberUtils.BNToBNS(
              this.bigNumberUtils.BNSToBN(getObject.balance) +
                this.bigNumberUtils.BNSToBN(d.balance),
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
