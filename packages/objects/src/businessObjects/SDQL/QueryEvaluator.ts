import { SDQL_Return } from "@objects/primitives";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { AST_Query } from "./AST_Query";
import { Operator } from "./Operator";
import { ConditionAnd } from "./condition/ConditionAnd";
import { ConditionGE } from "./condition/ConditionGE";
import ConditionIn from "./condition/ConditionIn";
import { ConditionL } from "./condition/ConditionL";

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
                // SDQL_OperatorName
                // rval
                // persistenceRepo
                //let ge_Condition = new ConditionGE().;
                //let l_Condition = (new ConditionL()).result()
                /*
                return SDQL_Return(
                    in_Condition.result()
                    new ConditionAnd(
                        (new ConditionGE()).result(),
                        (new ConditionL()).result()
                    )
                )
                */
            

            case "location":

        }
/*
        if (typeof(q.returnType) == typeof(boolean)){
            if (q.name == "location"){
                //let in_Condition = new ConditionIn();
                //return SDQL_Return((new ConditionIn(q.)).result())
            }
            if (q.name == "age"){

            }

        }
        if (typeof(q.returnType) == typeof(integer)){
            // location
            // conditions in - returns country code

            // type SDQL_Return = Brand<string|boolean|number|Array<any>, "SDQL_Return">;

            return SDQL_Return(1);


        }
        */

        return SDQL_Return(0);
    }

    // private evaluateConditionGE(lval: any, rval: any) {
    //     return lval == rval
    // }

}