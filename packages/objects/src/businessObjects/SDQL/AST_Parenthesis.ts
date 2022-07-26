import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";
import { Command_IF } from "./Command_IF";
import { Operator } from "./Operator";

export class AST_ParenthesisExpr extends AST_Expr{

    // we do not need this construct as the tree has the dependencies.
    
    constructor(
        readonly name: SDQL_Name,
        readonly source: Command_IF | AST_Query | Operator

    ) {
        super(name, source);
    }

}