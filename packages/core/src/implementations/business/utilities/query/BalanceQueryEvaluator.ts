import {
  BigNumberString,
  ChainId,
  EChainTechnology,
  EvalNotImplementedError,
  EVMContractAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ITokenBalance,
  PersistenceError,
  SDQL_Return,
  TickerSymbol,
  TokenAddress,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
  ) {}

  public eval(
    query: AST_BalanceQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.dataWalletPersistence
      .getAccountBalances()
      .andThen((balances) => {
        // console.log("line 41 balances", balances);
        if (query.networkId == null) {
          return okAsync(balances);
        }
        const networkBalances = balances.filter(
          (balance) => balance.chainId == query.networkId,
        );
        // console.log("line 48 networkBalances", networkBalances);
        return okAsync(networkBalances);
      })
      .andThen((balanceArray) => {
        // console.log("line 55 balanceArray", balanceArray);
        return this.evalConditions(query, balanceArray);
      })
      .andThen((balanceArray) => {
        // console.log("line 59 balanceArray", balanceArray);
        return this.combineContractValues(query, balanceArray);
      })
      .andThen((balanceArray) => {
        // console.log("line 63 balanceArray", balanceArray);
        return okAsync(SDQL_Return(balanceArray));
      });
  }

  public evalConditions(
    query: AST_BalanceQuery,
    balanceArray: ITokenBalance[],
  ): ResultAsync<ITokenBalance[], never> {
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
          throw new EvalNotImplementedError(condition.constructor.name);
      }
    }
    return okAsync(balanceArray);
  }

  public combineContractValues(
    query: AST_BalanceQuery,
    balanceArray: ITokenBalance[],
  ): ResultAsync<ITokenBalance[], PersistenceError> {
    const balanceMap = new Map<TokenAddress, ITokenBalance>();

    balanceArray.forEach((d) => {
      const getObject = balanceMap.get(d.tokenAddress);

      if (getObject) {
        balanceMap.set(d.tokenAddress, {
          ticker: getObject.ticker,
          balance: BigNumberString(
            BigNumber.from(getObject.balance)
              .add(BigNumber.from(d.balance))
              .toString(),
          ),
          chainId: getObject.chainId,
          tokenAddress: getObject.tokenAddress,
          type: getObject.type,
          quoteBalance: BigNumberString(
            BigNumber.from(getObject.quoteBalance)
              .add(BigNumber.from(d.quoteBalance))
              .toString(),
          ),
          accountAddress: getObject.accountAddress,
        });
      } else {
        balanceMap.set(d.tokenAddress, d);
      }
    });

    const returnedArray: ITokenBalance[] = [];
    balanceMap.forEach((element, key) => {
      returnedArray.push(element);
    });

    return okAsync(returnedArray);
  }
}
