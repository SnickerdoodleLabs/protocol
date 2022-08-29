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
} from "@snickerdoodlelabs/objects";
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
import { BigNumber } from "ethers";

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
        return okAsync(
          balances.filter((balance) => balance.chainId == query.networkId),
        );
      })
      .andThen((excessValues) => {
        let tokenBalances: ITokenBalance[] = [];
        let newToken: ITokenBalance = {
          networkId: ChainId(1),
          address: EVMContractAddress(""),
          balance: BigNumber.from("0"),
        };
        excessValues.forEach((object) => {
          newToken["networkId"] = object.chainId;
          newToken["address"] = object.contractAddress;
          newToken["balance"] = BigNumber.from(object.balance);
          tokenBalances.push(newToken);

          // refresh newToken so new info can be pushed in
          newToken = {
            networkId: ChainId(1),
            address: EVMContractAddress(""),
            balance: BigNumber.from("0"),
          };
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
    for (let condition of query.conditions) {
      //console.log("Condition: ", condition);
      //console.log("balanceArray: ", balanceArray);
      let val: BigNumber = BigNumber.from(0);
      switch (condition.constructor) {
        case ConditionGE:
          val = BigNumber.from((condition as ConditionGE).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter(
            (balance) =>
              BigNumber.from(balance.balance).toNumber() >= val.toNumber(),
          );
          //console.log("BalanceArray: ", balanceArray);
          break;
        case ConditionG:
          val = BigNumber.from((condition as ConditionG).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter(
            (balance) =>
              BigNumber.from(balance.balance).toNumber() > val.toNumber(),
          );
          break;
        case ConditionL:
          val = BigNumber.from((condition as ConditionL).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter(
            (balance) =>
              BigNumber.from(balance.balance).toNumber() < val.toNumber(),
          );
          break;
        case ConditionE:
          val = BigNumber.from((condition as ConditionE).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter(
            (balance) =>
              BigNumber.from(balance.balance).toNumber() == val.toNumber(),
          );
          break;
        case ConditionLE:
          val = BigNumber.from((condition as ConditionLE).rval);
          //console.log("val: ", val.toNumber());
          balanceArray = balanceArray.filter(
            (balance) =>
              BigNumber.from(balance.balance).toNumber() <= val.toNumber(),
          );
          break;

        default:
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
      balance: BigNumber.from("0"),
      networkId: ChainId(0),
      address: EVMContractAddress("0"),
    };
    let balanceMap = new Map<EVMContractAddress, ITokenBalance>();

    balanceArray.forEach((d) => {
      if (balanceMap.has(d.address)) {
        let getObject = balanceMap.get(d.address);
        if (getObject !== undefined) {
          obj = getObject;
        }
        obj.balance = BigNumber.from(
          obj.balance.toNumber() + d.balance.toNumber(),
        );
        balanceMap.set(d.address, obj);
      } else {
        balanceMap.set(d.address, {
          balance: d.balance,
          networkId: d.networkId,
          address: d.address,
        });
      }
    });

    let returnedArray: ITokenBalance[] = [];
    balanceMap.forEach((element, key) => {
      returnedArray.push({
        address: key,
        balance: element.balance,
        networkId: element.networkId,
      });
    });

    return okAsync(returnedArray);
  }
  // public evalConditions()
}
