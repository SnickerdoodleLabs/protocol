import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";

export class AST_BoolExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly expr: AST_Expr

    ) {
        super(name, expr);
        this.check();
    }

    check(): void {
        // TODO:
        throw new TypeError("Expected boolean return type")
    }

    

}