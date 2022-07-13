import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "../AST_Expr";
import { AST_Query } from "../AST_Query";
import { Condition } from "./Condition";

export class AST_ConditionExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly source: Condition

    ) {
        super(name, source);
        
    }



}