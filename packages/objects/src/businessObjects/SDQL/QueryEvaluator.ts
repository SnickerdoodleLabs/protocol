import { SDQL_Return } from "@objects/primitives";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { AST_Query } from "./AST_Query";

export class QueryEvaluator {

    public eval(query: AST_Query): any {
        // All the switch statements here
    }

    private evalNetworkQuery(q: AST_NetworkQuery): SDQL_Return {
        return SDQL_Return(0);
    } 

    private evalPropertyQuery(q: AST_PropertyQuery): SDQL_Return { 
        return SDQL_Return(0);
    }

}