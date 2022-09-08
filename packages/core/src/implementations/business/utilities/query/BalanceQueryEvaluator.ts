import {
  ChainId,
  EvalNotImplementedError,
  EVMContractAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
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
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
} from "@core/interfaces/objects/SDQL/condition/index.js";
import { AST_BalanceQuery } from "@core/interfaces/objects/SDQL/index.js";

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
        // console.log('networkBalances', networkBalances);
        return okAsync(networkBalances);
      })
      .andThen((excessValues) => {
        const tokenBalances: ITokenBalance[] = [];

        excessValues.forEach((object) => {
          const newToken: ITokenBalance = {
            ticker: object.ticker,
            networkId: object.chainId,
            address: object.contractAddress,
            balance: BigNumber.from(object.balance),
          };
          tokenBalances.push(newToken);
        });
        return okAsync(tokenBalances);
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
    balanceArray: ITokenBalance[],
  ): ResultAsync<ITokenBalance[], never> {
    for (const condition of query.conditions) {
      // console.log("Condition: ", condition);
      // console.log("balanceArray: ", balanceArray);
      let val: BigNumber = BigNumber.from(0);
      switch (condition.constructor) {
        case ConditionGE:
          val = BigNumber.from((condition as ConditionGE).rval);
          // console.log("val: ", val);
          // console.log("balanceArray: ", balanceArray);
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).gte(val),
          );
          //console.log("BalanceArray: ", balanceArray);
          break;
        case ConditionG:
          val = BigNumber.from((condition as ConditionG).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).gt(val),
          );
          break;
        case ConditionL:
          val = BigNumber.from((condition as ConditionL).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).lt(val),
          );
          break;
        case ConditionE:
          val = BigNumber.from((condition as ConditionE).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter((balance) =>
            BigNumber.from(balance.balance).eq(val),
          );
          break;
        case ConditionLE:
          val = BigNumber.from((condition as ConditionLE).rval);
          //console.log("val: ", val.toNumber());
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
    let obj: ITokenBalance = {
      ticker: TickerSymbol("ETH"),
      balance: BigNumber.from("0"),
      networkId: ChainId(0),
      address: EVMContractAddress("0"),
    };
    const balanceMap = new Map<EVMContractAddress, ITokenBalance>();

    balanceArray.forEach((d) => {
      if (balanceMap.has(d.address)) {
        const getObject = balanceMap.get(d.address);
        if (getObject !== undefined) {
          obj = getObject;
        }
        obj.balance = obj.balance.add(d.balance);

        balanceMap.set(d.address, obj);
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
