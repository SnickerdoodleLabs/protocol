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
    IDataWalletPersistenceType
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { AST_NetworkQuery } from "@snickerdoodlelabs/objects";

@injectable()
export class QueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence
    ) {}
    protected age: Age = Age(0);
    protected location: CountryCode = CountryCode(12345);
    protected result: SDQL_Return = SDQL_Return(true);

    public eval(query: AST_Query): any {
        // All the switch statements here
        console.log("Constructor: ", query.constructor);

        switch (query.constructor){
            case AST_NetworkQuery:
                return this.evalNetworkQuery(query as AST_NetworkQuery)
            default:
                return this.evalPropertyQuery(query as AST_PropertyQuery);
        }
    }
    public evalNetworkQuery(q: AST_NetworkQuery): SDQL_Return {
        return SDQL_Return(0);
    } 
    public evalPropertyQuery(q: AST_PropertyQuery): SDQL_Return { 
        switch (q.property){
            case "age":
                // const age = 25 // TODO replace with data
                //this.dataWalletPersistence.getAge().map( (age) => this.age = age);
                this.dataWalletPersistence.getAge().map(
                    (age) => {
                        switch(q.returnType){
                            case "boolean":
                                console.log("Property: Age, Return Type: Boolean");
                                console.log("Before conditions: ", this.result);
                                for (let condition of q.conditions) {
                                    this.result = this.result && this.evalPropertyConditon(age, condition);
                                }
                                console.log("After conditions: ", this.result);
                                return this.result;
                            case "integer": 
                                console.log("Property: Age, Return Type: Integer");
                                console.log("Returning age: ", age)
                                this.result = SDQL_Return(age);
                                return this.result;
                            case "number": 
                                console.log("Property: Age, Return Type: Number");
                                console.log("Returning age: ", age)
                                this.result = SDQL_Return(age);
                                return this.result;
                            default:
                                return this.result;
                        }
                        console.log("Tracking the result: ", this.result);
                    }
                );
                console.log("Tracking the result: ", this.result);
                return this.result;
            case "location":
                this.dataWalletPersistence.getLocation().map( (location) => this.location = location);
                switch(q.returnType){
                    case "boolean":
                        console.log("Property: Location, Return Type: Boolean");
                        for (let condition of q.conditions) {
                            this.result = this.result && this.evalPropertyConditon(this.location, condition);
                        }
                        return this.result;
                    case "integer": 
                        console.log("Property: Location, Return Type: Integer");
                        return SDQL_Return(this.age);
                    case "number": 
                        console.log("Property: Location, Return Type: Number");
                        return SDQL_Return(this.age);
                    default:
                        return SDQL_Return(false);
                }
            default:
                return SDQL_Return(false);
        }
    }

    public evalPropertyConditon(propertyVal: any, condition: Condition): SDQL_Return {
        console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
        switch(condition.constructor) {
            case ConditionGE:
                let val = (condition as ConditionGE).rval;
                console.log("PropertyVal is: ", propertyVal);
                console.log("Val is: ", val);
                console.log("Return should be: ", propertyVal >= val);
                return SDQL_Return(propertyVal >= val);
            case ConditionG:
                val = (condition as ConditionG).rval;
                return SDQL_Return(propertyVal > val);
            case ConditionE:
                val = (condition as ConditionE).rval;
                return SDQL_Return(propertyVal == val);
            case ConditionLE:
                val = (condition as ConditionLE).rval;
                return SDQL_Return(propertyVal <= val);
            case ConditionL:
                val = (condition as ConditionL).rval;
                return SDQL_Return(propertyVal < val);
            case ConditionIn:
                console.log("In Condition IN");
                let find_val = (condition as ConditionIn).lval;
                console.log("Looking for: ", find_val);
                let in_values = (condition as ConditionIn).rvals;
                console.log("Within: ", in_values);
                for (let i=0; i < in_values.length; i++){
                    if (find_val == in_values[i]){
                        return SDQL_Return(true);
                    }
                }
                return SDQL_Return(false);
            default:
                throw new EvalNotImplementedError(condition.constructor.name);
        }
    }
}

