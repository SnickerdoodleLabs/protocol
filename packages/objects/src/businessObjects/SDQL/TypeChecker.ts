import { AST_Expr } from "./AST_Expr";
import { AST_IFExpr } from "./AST_IFExpr";
import { AST_Query } from "./AST_Query";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { Command_IF } from "./Command_IF";
import { AST_ConditionExpr } from "./condition/AST_ConditionExpr";
import { Condition } from "./condition/Condition";

export class TypeChecker {

    static isValue(expr: any): boolean {
        /**
         * or can we just check if it's SDQL Return type?
         */
        return !(expr instanceof AST_Expr 
            || TypeChecker.isCondition(expr) 
            || TypeChecker.isIfCommand);
    }

    static isQuery(expr: any): boolean {
        return (expr instanceof AST_Query);
    }

    static isCondition(expr: any): boolean {
        return (expr instanceof Condition);
    }

    static isConditionExpr(expr: any): boolean {
        return (expr instanceof AST_ConditionExpr);
    }

    static isIfCommand(expr: any): boolean {
        return (expr instanceof Command_IF);
    }

    static isIfExpr(expr: any): boolean {
        return (expr instanceof AST_IFExpr);
    }

    static isReturnExpr(expr: any): boolean {
        return (expr instanceof AST_ReturnExpr);
    }


}