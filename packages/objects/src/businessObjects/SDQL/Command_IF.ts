import { SDQL_Name } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { AST_ConditionExpr } from "./condition/AST_ConditionExpr";

export class Command_IF{
    constructor(
        readonly name: SDQL_Name,
        readonly trueExpr: AST_ReturnExpr,
        readonly falseExpr: AST_ReturnExpr,
        readonly conditionExpr: AST_ConditionExpr

    ) {
    }
}