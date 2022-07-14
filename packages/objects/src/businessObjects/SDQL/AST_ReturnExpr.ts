import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";
import { AST_Return } from "./AST_Return";
import { Condition } from "./condition/Condition";

export class AST_ReturnExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly source: AST_Return

    ) {
        super(name, source);
        this.check();
    }

    check(): void {
        // TODO:
        throw new TypeError("Expected boolean return type")
    }



}