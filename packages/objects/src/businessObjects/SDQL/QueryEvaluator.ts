import { SDQL_Return } from "@objects/primitives";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { AST_Query } from "./AST_Query";
import { Operator } from "./Operator";
import { ConditionAnd } from "./condition/ConditionAnd";
import { ConditionGE } from "./condition/ConditionGE";
import ConditionIn from "./condition/ConditionIn";
import { ConditionL } from "./condition/ConditionL";
import { ConsentConditions } from "../ConsentConditions";
import { IDataWalletPersistence } from "@objects/interfaces";


export class QueryEvaluator {

    public eval(query: AST_Query): any {
        // All the switch statements here
        switch (query.constructor){
            case AST_NetworkQuery:
                //return this.evalNetworkQuery(query)
            default:
                return this.evalPropertyQuery(query as AST_PropertyQuery);
        }
    }

    private evalNetworkQuery(q: AST_NetworkQuery): SDQL_Return {
        return SDQL_Return(0);
    } 

    private evalPropertyQuery(q: AST_PropertyQuery): SDQL_Return { 
        switch (q.property){
            case "age":
                switch(q.returnType){
                    case "boolean":
                        console.log("Property: Age, Return Type: Boolean");
                        //age = this.persistenceLayer.getAge()

                        

                        for (let i=0; i < q.conditions.length; i++){
                            let cond = q.conditions[i];
                            
                            if (cond.name == "ge"){
                                console.log(cond.rval);

                                return SDQL_Return( (cond.rval) <= 25 )
                            }

                            let name = cond.name;
                            // ge
                            console.log("SDQL_Operator Name is: ", cond);
                        }

                        return SDQL_Return(true);
                    case "integer": 
                        console.log("Property: Age, Return Type: Integer");
                        return SDQL_Return(1);
                    case "number": 
                        console.log("Property: Age, Return Type: Number");
                        return SDQL_Return(1);
                    case "string": 
                        console.log("Property: Age, Return Type: String"); 
                        return SDQL_Return(1);
                    case "list": 
                        console.log("Property: Age, Return Type: List"); 
                        return SDQL_Return(1);
                    default:
                        return SDQL_Return(1);
                }
            case "location":
                switch(q.returnType){
                    case "boolean":
                        console.log("Property: Location, Return Type: Boolean");
                        return SDQL_Return(1);
                    case "integer": 
                        console.log("Property: Location, Return Type: Integer");
                        return SDQL_Return(1);
                    case "number": 
                        console.log("Property: Location, Return Type: Number");
                        return SDQL_Return(1);
                    case "string": 
                        console.log("Property: Location, Return Type: String"); 
                        return SDQL_Return(1);
                    case "list": 
                        console.log("Property: Location, Return Type: List"); 
                        return SDQL_Return(1);
                    default:
                        return SDQL_Return(1);
                }
            default:
                return SDQL_Return(0);
            }
        }
}

