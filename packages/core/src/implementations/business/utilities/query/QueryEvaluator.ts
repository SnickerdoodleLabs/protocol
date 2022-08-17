import {
    Age,
    CountryCode, EvalNotImplementedError, Gender,
    IDataWalletPersistence, IDataWalletPersistenceType,
    PersistenceError, SDQL_Return
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IQueryEvaluator } from "@core/interfaces/business/utilities";
import {
    AST_BalanceQuery, AST_Expr, AST_NetworkQuery,
    AST_PropertyQuery,
    AST_Query,
    Condition, ConditionE, ConditionG, ConditionGE,
    ConditionIn, ConditionL,
    ConditionLE
} from "@core/interfaces/objects";
import { IEVMBalance } from "@snickerdoodlelabs/objects";
import { EVMAccountAddress, EVMTransactionFilter } from "@snickerdoodlelabs/objects";
import { BalanceQueryEvaluator } from "./BalanceQueryEvaluator";

@injectable()
export class QueryEvaluator implements IQueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {
        
    }

    protected age: Age = Age(0);
    protected location: CountryCode = CountryCode("12345");
    protected balanceQueryEval: BalanceQueryEvaluator = new BalanceQueryEvaluator(this.dataWalletPersistence);

    public eval(query: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
    // All the switch statements here
    //console.log("Constructor: ", query.constructor);
        switch (query.constructor) {
            case AST_NetworkQuery:
                return this.evalNetworkQuery(query as AST_NetworkQuery);
        case AST_BalanceQuery:
            return this.evalBalanceQuery(query as AST_BalanceQuery);
        default:
            return this.evalPropertyQuery(query as AST_PropertyQuery);
        }
    }

    public evalBalanceQuery(q: AST_BalanceQuery): ResultAsync<SDQL_Return, PersistenceError> {

        return this.dataWalletPersistence.getAccountBalances().andThen( (balances) => {
            console.log("balances 1: ", balances);
            return okAsync(balances.filter((balance) => balance.chainId == q.networkId))
            //return okAsync(SDQL_Return(networkBalances));
          }
        ).andThen( (networkBalances) => {
            console.log("balances 2: ", networkBalances);
            return okAsync(this.balanceQueryEval.evalConditions(q.conditions, networkBalances));
        })
        //return errAsync(new PersistenceError("evalBalanceQuery not implemented"))
    }
   
    public evalNetworkQuery(q: AST_NetworkQuery): ResultAsync<SDQL_Return, PersistenceError> {
        let result = SDQL_Return(false);
        let chainId = q.contract.networkId;
        let address = q.contract.address as EVMAccountAddress;
        let hash = "";
        let startTime = q.contract.blockrange.start;
        let endTime = q.contract.blockrange.end;

        let filter = new EVMTransactionFilter(
            [chainId],
            [address],
            [hash],
            startTime,
            endTime
        );
        // console.log("Filter chainId: ", filter.chainIDs);
        // console.log("Filter addresses: ", filter.addresses);
        // console.log("Filter hashes: ", filter.hashes);
        // console.log("Filter startTime: ", filter.startTime);
        // console.log("Filter endTime: ", filter.endTime);

        return this.dataWalletPersistence.getEVMTransactions(filter).andThen(
            (transactions) =>
            {
                // console.log("Network Query Result: ", transactions)
                if (transactions == null){
                    return okAsync(SDQL_Return(false));
                }
                if (transactions.length == 0){
                    return okAsync(SDQL_Return(false));
                }
                return okAsync(SDQL_Return(true));
            }
        ) 
    } 

    public evalPropertyQuery(q: AST_PropertyQuery): ResultAsync<SDQL_Return, PersistenceError> { 
        let result = SDQL_Return(true);
        switch (q.property){
            case "age":
                // console.log("Tracking the result: ", result);
                return this.dataWalletPersistence.getAge().andThen(
                    (age) => 
                    {
                        switch(q.returnType){
                            case "boolean":
                                // console.log("Property: Age, Return Type: Boolean");
                                // console.log("Before conditions: ", result);
                                for (let condition of q.conditions) {
                                    result = (result) && (this.evalPropertyConditon(age, condition));
                                }
                                //console.log("After conditions: ", result);
                                return okAsync(result);
                            case "integer": 
                                //console.log("Property: Age, Return Type: Integer");
                                //console.log("Returning age: ", age)
                                result = SDQL_Return(age);
                                // console.log("Tracking the result: ", result);
                                return okAsync(result);
                            default:
                                // console.log("Tracking the result: ", result);
                                return okAsync(result);
                        }
                    }
                );
                console.log("Tracking the result: ", result);
                return okAsync(result);
            case "location":
                // console.log("Tracking the result: ", result);
                return this.dataWalletPersistence.getLocation().andThen( 
                    (location) => 
                    {
                        switch(q.returnType){
                            case "string": 
                                result = SDQL_Return(location);
                                return okAsync(result);
                            case "boolean":
                                // console.log("Property: Location, Return Type: Boolean");
                                // console.log("Before conditions: ", result);
                                for (let condition of q.conditions) {
                                    result = (result) && (this.evalPropertyConditon(location, condition));
                                }
                                //console.log("After conditions: ", result);
                                return okAsync(result);
                            case "integer": 
                                //console.log("Property: Location, Return Type: Integer");
                                //console.log("Returning location: ", location)
                                result = SDQL_Return(location);
                                return okAsync(result);
                            default:
                                return okAsync(result);
                        }
                    }
                );
                // console.log("Tracking the result: ", result);
                return okAsync(result);
            case "gender":
                // console.log("Tracking the result: ", result);
                return this.dataWalletPersistence.getGender().andThen( 
                    (gender) => 
                    {
                        // console.log("Gender: ", gender);
                        // console.log("Return Type: ", q.returnType);
                        switch(q.returnType){
                            case "enum":
                                // console.log("Property: Gender, Return Type: Enum");
                                // console.log("Gender: ", gender);
                                for (let key of q.enum_keys) {
                                    if (key == gender){
                                        return (okAsync(SDQL_Return(gender)))
                                    }
                                }
                                // console.log("After conditions: ", result);
                                return okAsync(SDQL_Return(Gender("unknown")));
                            default:
                                return okAsync(result);
                        }
                    }
                );
                return okAsync(result);
            case "url_visited_count":
                // console.log("Tracking the result: ", result);
                return this.dataWalletPersistence.getSiteVisitsMap().andThen( 
                    (url_visited_count) => 
                    {
                        // console.log("URL count: ", url_visited_count);
                        return (okAsync(SDQL_Return(url_visited_count))) 
                    }
                );
            case "chain_transaction_count":
 
                return this.dataWalletPersistence.getTransactionsMap().andThen( 
                    (transactionsMap) => 
                    {
                        // console.log("URL count: ", url_visited_count);
                        return (okAsync(SDQL_Return(transactionsMap))) 
                    }
                );
            default:
              // console.log("Tracking the result: ", result);
              return okAsync(result);
    }
    console.log("Tracking the result: ", result);
    return okAsync(result);
  }

  public evalPropertyConditon(
    propertyVal: any,
    condition: Condition,
  ): SDQL_Return {
    //console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
    let val: number | AST_Expr = 0;
    switch (condition.constructor) {
      case ConditionGE:
        val = (condition as ConditionGE).rval;
        //console.log("PropertyVal is: ", propertyVal);
        //console.log("Val is: ", val);
        //console.log("Return should be: ", propertyVal >= val);
        return SDQL_Return(propertyVal >= val);
      //return okAsync(SDQL_Return(propertyVal >= val));
      case ConditionG:
        val = (condition as ConditionG).rval;
        //console.log("PropertyVal is: ", propertyVal);
        //console.log("Val is: ", val);
        //console.log("Return should be: ", propertyVal > val);
        return SDQL_Return(propertyVal > val);
      //return okAsync(SDQL_Return(propertyVal > val));
      case ConditionL:
        val = (condition as ConditionL).rval;
        // console.log("PropertyVal is: ", propertyVal);
        // console.log("Val is: ", val);
        // console.log("Return should be: ", propertyVal < val);
        return SDQL_Return(propertyVal < val);
      //return okAsync(SDQL_Return(propertyVal < val));
      case ConditionE:
        val = (condition as ConditionE).rval;
        //console.log("PropertyVal is: ", propertyVal);
        //console.log("Val is: ", val);
        //console.log("Return should be: ", propertyVal == val);
        return SDQL_Return(propertyVal == val);
      //return okAsync(SDQL_Return(propertyVal == val));
      case ConditionLE:
        val = (condition as ConditionLE).rval;
        return SDQL_Return(propertyVal <= val);
      //return okAsync(SDQL_Return(propertyVal <= val));
      case ConditionIn:
        // console.log("In Condition IN");
        const find_val = (condition as ConditionIn).lval;
        // console.log("Looking for: ", find_val);
        const in_values = (condition as ConditionIn).rvals;
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

      default:
        throw new EvalNotImplementedError(condition.constructor.name);
    }
  }
}
