import { AST_Expr } from "./AST_Expr.js";
import { AST_Query } from "./AST_Query.js";
import { AST_ReturnExpr } from "./AST_ReturnExpr.js";
import { Command } from "./Command.js";
import { Command_IF } from "./Command_IF.js";
import { Operator } from "./Operator.js";

import { AST_ConditionExpr } from "@core/interfaces/objects/SDQL/condition/index.js";

export type AstAllowedTypes =
  | string
  | boolean
  | number
  | boolean
  | AST_Expr
  | AST_Query
  | Operator
  | Command;
export class TypeChecker {
  static isValue(expr: any): boolean {
    /**
     * or can we just check if it's SDQL Return type?
     */
    return !(
      expr instanceof AST_Expr ||
      TypeChecker.isQuery(expr) ||
      TypeChecker.isOperator(expr) ||
      TypeChecker.isCommand(expr)
    );
  }

  static isQuery(expr: any): boolean {
    return expr instanceof AST_Query;
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

  static isIfCommand(expr: any): boolean {
    return expr instanceof Command_IF;
  }

  // static isIfExpr(expr: any): boolean {
  //     return (expr instanceof AST_IFExpr);
  // }

  static isReturnExpr(expr: any): boolean {
    return expr instanceof AST_ReturnExpr;
  }

  static isPrimitiveExpr(expr: any): boolean {
    if (expr instanceof AST_Expr) {
      const primitives = ["number", "string", "boolean"];
      if (primitives.includes(typeof expr.source)) {
        return true;
      }
    }
    return false;
  }
}
