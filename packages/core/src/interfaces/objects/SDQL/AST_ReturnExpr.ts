import { SDQL_Name } from "@snickerdoodlelabs/objects";
import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";
import { AST_Return } from "./AST_Return";

export class AST_ReturnExpr extends AST_Expr {
    /**
     * Always resolves to a boolean value
     */
    constructor(
        readonly name: SDQL_Name,
        readonly source: AST_Return | AST_Query

    ) {
        super(name, source);
    }




}