import {
  BigNumberString,
  ChainId,
  EvalNotImplementedError,
  PersistenceError,
  SDQL_Return,
  TokenAddress,
  TokenBalance,
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

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
  constructor(
    @inject(IPortfolioBalanceRepositoryType)
    protected balanceRepo: IPortfolioBalanceRepository,
  ) {}

  public eval(
    query: AST_BalanceQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.balanceRepo
      .getAccountBalancesWithoutOwnerAddress()
      .andThen((balances) => {
        if (query.networkId == null) {
          return okAsync(balances);
        }
        const networkBalances = balances.filter(
          (balance) => balance.chainId == query.networkId,
        );
        return okAsync(networkBalances);
      })
      .andThen((balanceArray) => {
        return this.evalConditions(query, balanceArray);
      })
      .andThen((balanceArray) => {
        return this.combineContractValues(query, balanceArray);
      })
      .andThen((balanceArray) => {
        return okAsync(SDQL_Return(balanceArray));
      });
  }

  public evalConditions(
    query: AST_BalanceQuery,
    balanceArray: Omit<TokenBalance, "accountAddress">[],
  ): ResultAsync<Omit<TokenBalance, "accountAddress">[], never> {
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
    balanceArray: Omit<TokenBalance, "accountAddress">[],
  ): ResultAsync<Omit<TokenBalance, "accountAddress">[], PersistenceError> {
    const balanceMap = new Map<
      `${ChainId}-${TokenAddress}`,
      Omit<TokenBalance, "accountAddress">
    >();

    const nonZeroBalanceArray = balanceArray.filter((item) => {
      const ethValue = ethers.BigNumber.from(item.balance);
      return !ethValue.eq(0);
    });

    nonZeroBalanceArray.forEach((d) => {
      const networkIdAndAddress: `${ChainId}-${TokenAddress}` = `${d.chainId}-${d.tokenAddress}`;
      const getObject = balanceMap.get(networkIdAndAddress);

      if (getObject) {
        const balance: Omit<TokenBalance, "accountAddress"> = {
          type: getObject.type,
          ticker: getObject.ticker,
          chainId: getObject.chainId,
          tokenAddress: getObject.tokenAddress || "0x0",
          balance: BigNumberString(
            BigNumber.from(getObject.balance)
              .add(BigNumber.from(d.balance))
              .toString(),
          ),
          decimals: getObject.decimals,
        };
        balanceMap.set(networkIdAndAddress, balance);
      } else {
        balanceMap.set(networkIdAndAddress, d);
      }
    });

    return okAsync(Array.from(balanceMap.values()));
  }
}
