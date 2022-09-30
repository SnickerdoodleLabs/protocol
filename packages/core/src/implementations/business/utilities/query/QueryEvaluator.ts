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
import { concat } from "rxjs";

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
        return this.dataWalletPersistence.getTransactionsArray()
        .andThen((transactionsArray) => {
          // return okAsync(SDQL_Return(transactionsArray))
            // console.log("line 144 transactionsArray", transactionsArray);
            // let items = transactionsArray.filter(obj => (obj.items?.length != 0));   
            
            console.log("Transactions: ");
            console.log(transactionsArray);
            return ResultUtils.combine([
              this.convertTransactions(transactionsArray),
              this.dataWalletPersistence.getAccounts()
            ])
            
        }).andThen(([convertedTrans, accounts]) => {
          // console.log("line 152 convertedTrans", convertedTrans);
          return this.TransactionFlowOutput(convertedTrans, accounts);
        
        }).andThen((finalArray) => {
          // console.log("line 156 finalArray", finalArray);
          return okAsync(SDQL_Return(finalArray))
        })
      default:
        // console.log("Tracking the result: ", result);
        return okAsync(result);
    }
  }

  public convertTransactions(
    transactionsArray: {chainId: ChainId, items: EVMTransaction[] | null}[]
  ): ResultAsync<EVMTransaction[], PersistenceError>{
  
    let returnedTransactions : EVMTransaction[] = [];

    for (const chain of transactionsArray) {
      // console.log("line 173  chain items", chain);
      console.log(`QueryEvaluator: line 174 converting ${chain.items!.length} items for chain ${chain.chainId}`)
      const items = chain.items;
      if (items != null) {
        // console.log("line 177  items", items);
        returnedTransactions.push(...items);
        // console.log("line 178 returnedTransactions", returnedTransactions);
      }
    }

    return okAsync(returnedTransactions);
  }
      
  // passed in transArray of only values with items that have values
  // passed in accounts Array
  protected TransactionFlowOutput(
    transactionsArray: EVMTransaction[], 
    accounts: EVMAccountAddress[]
  ): ResultAsync<IChainTransaction[], PersistenceError>{
    const flowMap = new Map<ChainId, IChainTransaction>();

    transactionsArray.forEach((obj) => {

      const getObject = flowMap.get(obj.chainId);
      let to_address = obj.to;
      let from_address = obj.from;

      if (getObject) {
        if (to_address != null){
          if (accounts.includes(to_address)){
            flowMap.set(obj.chainId, {
              chainId: obj.chainId, 
              outgoingValue: getObject.outgoingValue,
              outgoingCount: getObject.outgoingCount,
              incomingValue: BigNumberString(
                (BigNumber.from(getObject.incomingValue).add(BigNumber.from(obj.value))).toString()
              ),
              incomingCount: BigNumberString(
                (BigNumber.from(getObject.incomingCount).add(BigNumber.from("1"))).toString()
              )
            });
          } 
        }
        if (from_address != null){
          if (accounts.includes(from_address)){
            flowMap.set(obj.chainId, {
              chainId: obj.chainId, 
              outgoingValue: BigNumberString(
                (BigNumber.from(getObject.outgoingValue).add(BigNumber.from(obj.value))).toString()
              ),
              outgoingCount:  BigNumberString(
                (BigNumber.from(getObject.outgoingCount).add(BigNumber.from("1"))).toString()
              ),
              incomingValue: getObject.incomingValue,
              incomingCount: getObject.incomingCount
            });
          } 
        }
      } else {
        
        if (to_address != null){
          if (accounts.includes(to_address)){
            flowMap.set(obj.chainId, {
              chainId: obj.chainId, 
              outgoingValue: BigNumberString("0"),
              outgoingCount: BigNumberString("0"),
              incomingValue: BigNumberString(BigNumber.from(obj.value).toString()),
              incomingCount: BigNumberString("1"),
            });
          } 
        }
        if (from_address != null){
          if (accounts.includes(from_address)){
            flowMap.set(obj.chainId, {
              chainId: obj.chainId, 
              outgoingValue: BigNumberString(BigNumber.from(obj.value).toString()),
              outgoingCount: BigNumberString("1"),
              incomingValue: BigNumberString("0"),
              incomingCount: BigNumberString("0"),
            });
          } 
        }
      }
    });

    const outputFlow: IChainTransaction[] = [];
    flowMap.forEach((element, key) => {
      outputFlow.push(element);
    });

    return okAsync(outputFlow);
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
