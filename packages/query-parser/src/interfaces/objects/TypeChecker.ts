import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Subquery } from "@query-parser/interfaces/objects/AST_Subquery.js";
import { Command } from "@query-parser/interfaces/objects/Command.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";
import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";

export type AstAllowedTypes =
  | string
  | boolean
  | number
  | boolean
  | AST_Expr
  | AST_Subquery
  | AST_Insight
  | Operator
  | Command;

export class TypeChecker {
  static isValue(expr: any): boolean {
    return !(
      expr instanceof AST_Expr ||
      TypeChecker.isSubquery(expr) ||
      TypeChecker.isAd(expr) ||
      TypeChecker.isInsight(expr) ||
      TypeChecker.isOperator(expr) ||
      TypeChecker.isCommand(expr)
    );
  }

  static isSubquery(expr: any): boolean {
    return expr instanceof AST_Subquery;
  }

  static isAd(expr: any): boolean {
    return expr instanceof AST_Ad;
  }

  static isInsight(expr: any): boolean {
    return expr instanceof AST_Insight;
  }

  static isOperator(expr: any): boolean {
    return expr instanceof Operator;
  }

  static isConditionExpr(expr: any): boolean {
    return expr instanceof AST_ConditionExpr;
  }

  static isCommand(expr: any): boolean {
    return expr instanceof Command;
  }

  static isPrimitiveExpr(expr: any): boolean {
    return (
      expr instanceof AST_Expr &&
      (["number", "string", "boolean"].includes(typeof expr.source) ||
        expr.source == null)
    );
  }
}
