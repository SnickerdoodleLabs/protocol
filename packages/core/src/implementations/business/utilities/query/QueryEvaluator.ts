import { Age, CountryCode, SDQL_Return } from "@objects/primitives";
import { 
    AST_PropertyQuery,
    AST_Query,
    IDataWalletPersistence, 
    EvalNotImplementedError,
    Condition, 
    ConditionGE, 
    ConditionIn,
    ConditionG,
    ConditionL,
    ConditionLE,
    ConditionE,   
    IDataWalletPersistenceType,
    PersistenceError,
    AST_Expr
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { AST_NetworkQuery } from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

@injectable()
export class QueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence
    ) {}
    protected age: Age = Age(0);
    protected location: CountryCode = CountryCode(12345);

    public eval(query: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
        // All the switch statements here
        //console.log("Constructor: ", query.constructor);
        switch (query.constructor){
            case AST_NetworkQuery:
                return this.evalNetworkQuery(query as AST_NetworkQuery)
            default:
                return (this.evalPropertyQuery(query as AST_PropertyQuery));
        }
    }
    public evalNetworkQuery(q: AST_NetworkQuery): ResultAsync<SDQL_Return, PersistenceError> {
        return okAsync(SDQL_Return(0));
    } 
    public evalPropertyQuery(q: AST_PropertyQuery): ResultAsync<SDQL_Return, PersistenceError> { 
        let result = SDQL_Return(true);
        switch (q.property){
            case "age":
                //console.log("Tracking the result: ", result);
                return this.dataWalletPersistence.getAge().andThen(
                    (age) => 
                    {
                        switch(q.returnType){
                            case "boolean":
                                //console.log("Property: Age, Return Type: Boolean");
                                //console.log("Before conditions: ", result);
                                for (let condition of q.conditions) {
                                    result = (result) && (this.evalPropertyConditon(age, condition));
                                }
                                //console.log("After conditions: ", result);
                                return okAsync(result);
                            case "integer": 
                                //console.log("Property: Age, Return Type: Integer");
                                //console.log("Returning age: ", age)
                                result = SDQL_Return(age);
                                //console.log("Tracking the result: ", result);
                                return okAsync(result);
                            default:
                                //console.log("Tracking the result: ", result);
                                return okAsync(result);
                        }
                    }
                );
                console.log("Tracking the result: ", result);
                return okAsync(result);
            case "location":
                this.dataWalletPersistence.getLocation().map( 
                    (location) => {
                        switch(q.returnType){
                            case "boolean":
                                //console.log("Property: Location, Return Type: Boolean");
                                for (let condition of q.conditions) {
                                    result = result && this.evalPropertyConditon(location, condition);
                                }
                                return result;
                            case "integer": 
                                //console.log("Property: Location, Return Type: Integer");
                                //console.log("Returning location: ", location)
                                result = SDQL_Return(location);
                                return result;
                            case "number": 
                                //console.log("Property: Location, Return Type: Number");
                                //console.log("Returning location: ", location)
                                result = SDQL_Return(location);
                                return result;
                            default:
                                return result;
                        }
                });
                //console.log("Tracking the result: ", result);
                return okAsync(result);
            default:
                //console.log("Tracking the result: ", result);
                return okAsync(result);
        }
        console.log("Tracking the result: ", result);
        return okAsync(result);
        
    }

    public evalPropertyConditon(propertyVal: any, condition: Condition): SDQL_Return {
        //console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
        let val: number | AST_Expr = 0;
        switch(condition.constructor) {
            case ConditionGE:
                val = (condition as ConditionGE).rval;
                //console.log("PropertyVal is: ", propertyVal);
                //console.log("Val is: ", val);
                //console.log("Return should be: ", propertyVal >= val);
                return (SDQL_Return(propertyVal >= val));
                //return okAsync(SDQL_Return(propertyVal >= val));
            case ConditionG:
                val = (condition as ConditionG).rval;
                //console.log("PropertyVal is: ", propertyVal);
                //console.log("Val is: ", val);
                //console.log("Return should be: ", propertyVal > val);
                return (SDQL_Return(propertyVal > val));
                //return okAsync(SDQL_Return(propertyVal > val));
            case ConditionE:
                val = (condition as ConditionE).rval;
                //console.log("PropertyVal is: ", propertyVal);
                //console.log("Val is: ", val);
                //console.log("Return should be: ", propertyVal == val);
                return (SDQL_Return(propertyVal == val));
                //return okAsync(SDQL_Return(propertyVal == val));
            case ConditionLE:
                val = (condition as ConditionLE).rval;
                return (SDQL_Return(propertyVal <= val));
                //return okAsync(SDQL_Return(propertyVal <= val));

            case ConditionL:
                val = (condition as ConditionL).rval;
                console.log("PropertyVal is: ", propertyVal);
                console.log("Val is: ", val);
                console.log("Return should be: ", propertyVal < val);
                return (SDQL_Return(propertyVal < val));
                //return okAsync(SDQL_Return(propertyVal < val));

            case ConditionIn:
                //console.log("In Condition IN");
                let find_val = (condition as ConditionIn).lval;
                //console.log("Looking for: ", find_val);
                let in_values = (condition as ConditionIn).rvals;
                //console.log("Within: ", in_values);
                for (let i=0; i < in_values.length; i++){
                    if (find_val == in_values[i]){
                        return (SDQL_Return(true));
                        //return okAsync(SDQL_Return(true));

                    }
                }
                return (SDQL_Return(false));
                //return okAsync(SDQL_Return(false));

            default:
                throw new EvalNotImplementedError(condition.constructor.name);
        }
    }
}

