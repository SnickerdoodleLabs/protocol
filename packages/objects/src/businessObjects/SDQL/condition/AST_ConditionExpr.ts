import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "../AST_Expr";
import { AST_Query } from "../AST_Query";
import { Operator } from "../Operator";

export class AST_ConditionExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly source: Operator | AST_Query

    ) {
        super(name, source);
        
    }

    check(): void {
        // TODO if query, check type
        
    }



}