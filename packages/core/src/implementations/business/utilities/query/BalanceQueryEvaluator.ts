import {
  ChainId,
  EvalNotImplementedError,
  EVMContractAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEVMBalance,
  ITokenBalance,
  PersistenceError,
  SDQL_Return,
  TickerSymbol,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
  AST_BalanceQuery,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
} from "@core/interfaces/objects";

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
        if (query.networkId == null) {
          return okAsync(balances);
        }
        const networkBalances = balances.filter(
          (balance) => balance.chainId == query.networkId,
        );
        return okAsync(networkBalances);
      })
      .andThen((excessValues) => {
        return this.addBalance(excessValues);
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

  public addBalance(excessValues: IEVMBalance[]): ResultAsync<ITokenBalance[], never>{
    const tokenBalances: ITokenBalance[] = [];
    excessValues.forEach(element => {
      tokenBalances.push({
        ticker: element.ticker,
        networkId: element.chainId,
        address: element.contractAddress,
        balance: BigNumber.from(element.balance)
      })
    });
    return okAsync(tokenBalances);
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

    const balanceMap = new Map<EVMContractAddress, ITokenBalance>();

    balanceArray.forEach((d) => {
      const getObject = balanceMap.get(d.address);

      if (getObject) {
        balanceMap.set(d.address, {
          ticker: getObject.ticker,
          balance: getObject.balance.add(d.balance),
          networkId: getObject.networkId,
          address: getObject.address,
        });
      } else {
        balanceMap.set(d.address, {
          ticker: d.ticker,
          balance: d.balance,
          networkId: d.networkId,
          address: d.address,
        });
      }
    });

    const returnedArray: ITokenBalance[] = [];
    balanceMap.forEach((element, key) => {
      returnedArray.push({
        ticker: element.ticker,
        address: key,
        balance: element.balance,
        networkId: element.networkId,
      });
    });

    return okAsync(returnedArray);
  }
  // public evalConditions()
}
