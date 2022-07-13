import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition/Condition";

export class AST_BoolExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly source: AST_Query | Condition

    ) {
        super(name, source);
        this.check();
    }

    check(): void {
        // TODO:
        throw new TypeError("Expected boolean return type")
    }



}