import {
  BigNumberString,
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
        if (query.networkId == null) {
          return okAsync(balances);
        }
        const networkBalances = balances.filter(
          (balance) => balance.chainId == query.networkId,
        );
        return okAsync(networkBalances);
      })
      .andThen((excessValues) => {
        return this.convertToTokenBalance(excessValues);
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

  public convertToTokenBalance(
    excessValues: IEVMBalance[],
  ): ResultAsync<ITokenBalance[], never> {
    const tokenBalances: ITokenBalance[] = [];
    excessValues.forEach((element) => {
      tokenBalances.push({
        ticker: element.ticker,
        networkId: element.chainId,
        address: element.contractAddress,
        balance: element.balance,
      });
    });
    return okAsync(tokenBalances);
  }

  public evalConditions(
    query: AST_BalanceQuery,
    balanceArray: ITokenBalance[],
  ): ResultAsync<ITokenBalance[], never> {
    for (const condition of query.conditions) {
      let val: BigNumber = BigNumber.from(0);
      console.log("condition: ", condition);

      switch (condition.constructor) {
        case ConditionGE:
          val = BigNumber.from((condition as ConditionGE).rval);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).gte(val),
          );
          console.log("val: ", val);
          console.log("balanceArray: ", balanceArray);

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
          console.log("val: ", val);
          console.log("balanceArray: ", balanceArray);
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
    console.log("Final Balance Array: ", balanceArray);
    return okAsync(balanceArray);
  }

  public combineContractValues(
    query: AST_BalanceQuery,
    balanceArray: ITokenBalance[],
  ): ResultAsync<ITokenBalance[], PersistenceError> {
    const balanceMap = new Map<
      `${ChainId}-${EVMContractAddress}`,
      ITokenBalance
    >();

    const nonZeroBalanceArray = balanceArray.filter((item) => {
      const ethValue = ethers.BigNumber.from(item.balance);
      return ethValue.eq(0) === false;
    });

    nonZeroBalanceArray.forEach((d) => {
      const networkIdAndAddress: `${ChainId}-${EVMContractAddress}` = `${d.networkId}-${d.address}`;
      const getObject = balanceMap.get(networkIdAndAddress);

      if (getObject) {
        balanceMap.set(networkIdAndAddress, {
          ticker: getObject.ticker,
          balance: BigNumberString(
            BigNumber.from(getObject.balance)
              .add(BigNumber.from(d.balance))
              .toString(),
          ),
          networkId: getObject.networkId,
          address: getObject.address,
        });
      } else {
        balanceMap.set(networkIdAndAddress, {
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
        address: element.address,
        balance: BigNumberString(element.balance.toString()),
        networkId: element.networkId,
      });
    });
    console.log("returnedArray: ", returnedArray);
    return okAsync(returnedArray);
  }
}
