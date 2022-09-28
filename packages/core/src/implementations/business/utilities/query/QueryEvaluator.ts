import {
  Age,
  BigNumberString,
  ChainId,
  CountryCode,
  EvalNotImplementedError,
  EVMAccountAddress,
  EVMTransaction,
  Gender,
  IChainTransaction,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  PersistenceError,
  SDQL_Return,
  TickerSymbol,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  AST_Expr,
  AST_NetworkQuery,
  AST_PropertyQuery,
  AST_Query,
  Condition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator.js";
import {
  INetworkQueryEvaluator,
  INetworkQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/INetworkQueryEvaluator.js";
import { IQueryEvaluator } from "@core/interfaces/business/utilities/query/IQueryEvaluator.js";
import { valueToNode } from "@babel/types";
import { ResultUtils } from "neverthrow-result-utils";
import { BigNumber } from "ethers";

@injectable()
export class QueryEvaluator implements IQueryEvaluator {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IBalanceQueryEvaluatorType)
    protected balanceQueryEvaluator: IBalanceQueryEvaluator,
    @inject(INetworkQueryEvaluatorType)
    protected networkQueryEvaluator: INetworkQueryEvaluator,
  ) {}

  protected age: Age = Age(0);
  protected location: CountryCode = CountryCode("12345");

  public eval<T extends AST_Query>(
    query: T,
  ): ResultAsync<SDQL_Return, PersistenceError> {

    if (query instanceof AST_NetworkQuery) {
      return this.networkQueryEvaluator.eval(query);
    } else if (query instanceof AST_BalanceQuery) {
      return this.balanceQueryEvaluator.eval(query);
    } else if (query instanceof AST_PropertyQuery) {
      return this.evalPropertyQuery(query);
    }

    return errAsync(
      new PersistenceError(
        `Unknown query type in QueryEvaluator.eval, ${query.name}`,
      ),
    );
  }

  public evalPropertyQuery(
    q: AST_PropertyQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    let result = SDQL_Return(true);
    switch (q.property) {
      case "age":
        return this.dataWalletPersistence.getAge().andThen((age) => {
          switch (q.returnType) {
            case "boolean":
              for (const condition of q.conditions) {
                result = result && this.evalPropertyConditon(age, condition);
              }
              return okAsync(result);
            case "integer":
              result = SDQL_Return(age);
              return okAsync(result);
            default:
              return okAsync(result);
          }
        });
        return okAsync(result);
      case "location":
        return this.dataWalletPersistence.getLocation().andThen((location) => {
          switch (q.returnType) {
            case "string":
              result = SDQL_Return(location);
              return okAsync(result);
            case "boolean":
              for (const condition of q.conditions) {
                result =
                  result && this.evalPropertyConditon(location, condition);
              }
              return okAsync(result);
            case "integer":
              result = SDQL_Return(location);
              return okAsync(result);
            default:
              return okAsync(result);
          }
        });
      case "gender":
        return this.dataWalletPersistence.getGender().andThen((gender) => {
          switch (q.returnType) {
            case "enum":
              for (const key of q.enum_keys) {
                if (key == gender) {
                  return okAsync(SDQL_Return(gender));
                }
              }
              return okAsync(SDQL_Return(Gender("unknown")));
            default:
              return okAsync(result);
          }
        });
      case "url_visited_count":
        return this.dataWalletPersistence
          .getSiteVisitsMap()
          .andThen((url_visited_count) => {
            return okAsync(SDQL_Return(url_visited_count));
          });
      case "chain_transactions":
        return ResultUtils.combine([
          this.dataWalletPersistence.getTransactionsArray(),
          this.dataWalletPersistence.getAccounts()
        ]).andThen(([transactionsArray, accounts]) => {
            let items = transactionsArray.filter(obj => (obj.items?.length != 0));            
            return this.TransactionFlowOutput(items, accounts);
        }).andThen((chainTrans) => {
          return okAsync(SDQL_Return(chainTrans))
        })
      default:
        // console.log("Tracking the result: ", result);
        return okAsync(result);
    }
  }

      
  // passed in transArray of only values with items that have values
  // passed in accounts Array
  protected TransactionFlowOutput(
    transactionsArray: {chainId: ChainId, items: EVMTransaction[] | null}[], 
    accounts: EVMAccountAddress[]
  ): ResultAsync<IChainTransaction[], PersistenceError>{
    let outputFlow : IChainTransaction[] = [];

    for (let i = 0; i < transactionsArray.length; i++){
      let obj = transactionsArray[i];
      let transChain = obj["chainId"];
      let outgoingFlag;

      if (obj["items"]?.length !== 0){

        let chainFlowObj = {
          chainId: transChain,
          outgoingValue: BigNumberString("0"),
          outgoingCount: BigNumberString("0"),
          incomingValue: BigNumberString("0"),
          incomingCount: BigNumberString("0")
        }

        let j = 0;
        if (obj["items"] != null){
          while(j < obj["items"]?.length){
            let transaction = obj["items"][j];
            let dollars = transaction.value;
            let to_address = transaction.to;
            let from_address = transaction.from;

            if (to_address != null){
              console.log("Accounts: ");
              console.log(accounts);
              console.log("to_address: ");
              console.log(to_address);
              console.log("from_address: ");
              console.log(from_address);

              if (accounts.includes(to_address)){
                chainFlowObj.incomingCount = BigNumberString(
                  (BigNumber.from(chainFlowObj.incomingCount).add(BigNumber.from("1"))).toString()
                );
                chainFlowObj.incomingValue = BigNumberString(
                  (BigNumber.from(chainFlowObj.incomingValue).add(BigNumber.from(dollars))).toString()
                );
              }
            }
            if (from_address != null){
              if (accounts.includes(from_address)){
                chainFlowObj.outgoingCount = BigNumberString(
                  (BigNumber.from(chainFlowObj.outgoingCount).add(BigNumber.from("1"))).toString()
                );
                chainFlowObj.outgoingValue = BigNumberString(
                  (BigNumber.from(chainFlowObj.outgoingValue).add(BigNumber.from(dollars))).toString()
                );
              }            
            }
            j = j + 1;
          }
        }
        outputFlow.push(chainFlowObj)
      }

    }
    return okAsync((outputFlow));
  }



  public evalPropertyConditon(
    propertyVal: Age | CountryCode | null,
    condition: Condition,
  ): SDQL_Return {
    if (propertyVal == null) {
      const err = new Error("In evalPropertyConditon, propertyVal is null!");
      console.error(err);
      throw err;
    }
    //console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
    let val: number | AST_Expr = 0;
    if (condition instanceof ConditionGE) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal >= val);
      return SDQL_Return(propertyVal >= val);
      //return okAsync(SDQL_Return(propertyVal >= val));
    } else if (condition instanceof ConditionG) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal > val);
      return SDQL_Return(propertyVal > val);
      //return okAsync(SDQL_Return(propertyVal > val));
    } else if (condition instanceof ConditionL) {
      val = condition.rval;
      // console.log("PropertyVal is: ", propertyVal);
      // console.log("Val is: ", val);
      // console.log("Return should be: ", propertyVal < val);
      return SDQL_Return(propertyVal < val);
      //return okAsync(SDQL_Return(propertyVal < val));
    } else if (condition instanceof ConditionE) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal == val);
      return SDQL_Return(propertyVal == val);
      //return okAsync(SDQL_Return(propertyVal == val));
    } else if (condition instanceof ConditionLE) {
      val = condition.rval;
      return SDQL_Return(propertyVal <= val);
      //return okAsync(SDQL_Return(propertyVal <= val));
    } else if (condition instanceof ConditionIn) {
      // console.log("In Condition IN");
      const find_val = condition.lval;
      // console.log("Looking for: ", find_val);
      const in_values = condition.rvals;
      // console.log("Within: ", in_values);
      for (let i = 0; i < in_values.length; i++) {
        if (find_val == in_values[i]) {
          // console.log("Found: ", find_val);
          return SDQL_Return(true);
          //return okAsync(SDQL_Return(true));
        }
      }
      // console.log("Did not Find: ", find_val);
      return SDQL_Return(false);
      //return okAsync(SDQL_Return(false));
    }

    console.error(`EvalNotImplementedError ${condition.constructor.name}`);
    throw new EvalNotImplementedError(condition.constructor.name);
  }
}
