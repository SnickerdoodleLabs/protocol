import {
  AST_RequireExpr,
  AST_SubQuery,
  BinaryCondition,
} from "@query-parser/interfaces/index.js";
import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { Command } from "@query-parser/interfaces/objects/Command.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";
import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";

export type AstAllowedTypes =
  | string
  | boolean
  | number
  | boolean
  | AST_Expr
  | AST_SubQuery
  | AST_Insight
  | Operator
  | Command;

export class TypeChecker {
  static isValue(expr: any): boolean {
    return !(
      expr instanceof AST_Expr ||
      TypeChecker.isSubQuery(expr) ||
      TypeChecker.isAd(expr) ||
      TypeChecker.isInsight(expr) ||
      TypeChecker.isOperator(expr) ||
      TypeChecker.isCommand(expr)
    );
  }

  static isSubQuery(expr: any): expr is AST_SubQuery {
    return expr instanceof AST_SubQuery;
  }

  static isAd(expr: any): expr is AST_Ad {
    return expr instanceof AST_Ad;
  }

  static isInsight(expr: any): expr is AST_Insight {
    return expr instanceof AST_Insight;
  }

  static isOperator(expr: any): expr is Operator {
    return expr instanceof Operator;
  }

  static isBinaryCondition(expr: any): expr is BinaryCondition {
    return expr instanceof BinaryCondition;
  }

  static isConditionExpr(expr: any): expr is AST_ConditionExpr {
    return expr instanceof AST_ConditionExpr;
  }

  static isCommand(expr: any): expr is Command {
    return expr instanceof Command;
  }

  static isBoolean(expr: any): expr is boolean {
    return typeof expr === "boolean";
  }

  static isCommandIf(expr: any): expr is Command_IF {
    return expr instanceof Command_IF;
  }

  static isAstRequireExpr(expr: any): expr is AST_RequireExpr {
    return expr instanceof AST_RequireExpr;
  }

  static isPrimitiveExpr(expr: any): boolean {
    return (
      expr instanceof AST_Expr &&
      (["number", "string", "boolean"].includes(typeof expr.source) ||
        expr.source == null)
    );
  }
}
