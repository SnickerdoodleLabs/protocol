import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";

export class Command_IF{
    constructor(
        readonly name: SDQL_Name,
        readonly trueExpr: AST_Expr,
        readonly falseExpr: AST_Expr,
        readonly conditionExpr: AST_Expr

    ) {
    }
}