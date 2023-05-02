import {
  DataPermissions,
  EvalNotImplementedError,
  EvaluationError,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_Subquery,
  BinaryCondition,
  Command_IF,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
  ConditionOr,
  Operator,
  TypeChecker,
} from "@snickerdoodlelabs/query-parser";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IQueryRepository } from "@core/interfaces/business/utilities/query/index.js";
import { ResultUtils } from "neverthrow-result-utils";

export class AST_Evaluator {
  readonly operatorMap = new Map<Function, Function>();
  readonly expMap = new Map<Function, Function>();

  constructor(
    readonly queryRepository: IQueryRepository,
    readonly dataPermissions: DataPermissions,
  ) {
    [
      ConditionAnd,
      ConditionOr,
      ConditionE,
      ConditionG,
      ConditionGE,
      ConditionL,
      ConditionLE,
      ConditionIn,
    ].forEach((cond) => this.operatorMap.set(cond, this.evalBinaryOperator));

    this.expMap.set(Operator, this.evalOperator);
    this.expMap.set(AST_ConditionExpr, this.evalConditionExpr);
  }

  public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr);
    } else if (TypeChecker.isSubquery(expr)) {
      return this.evalSubquery(expr);
    }
    return this.evalExpr(expr);
  }

  public evalExpr(
    expr: AST_Expr | Command_IF | Operator,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (TypeChecker.isPrimitiveExpr(expr)) {
      return okAsync(
        SDQL_Return((expr as AST_Expr).source ?? (false as SDQL_Return)),
      );
    } else {
      const evaluator = this.expMap.get(expr.constructor);
      if (evaluator) {
        return evaluator.apply(this, [expr]);
      } else {
        return errAsync(new EvalNotImplementedError(typeof expr));
      }
    }
  }

  public evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (TypeChecker.isSubquery(expr.source)) {
      return this.evalSubquery(expr.source as AST_Subquery);
    } else if (TypeChecker.isOperator(expr.source)) {
      return this.evalOperator(expr.source as Operator);
    } else {
      return errAsync<SDQL_Return, EvaluationError>(
        new EvaluationError("Condition has wrong type"),
      );
    }
  }

  //#region operator evaluation
  public evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError> {
    const evaluator = this.operatorMap.get(op.constructor);
    if (evaluator) {
      return evaluator.apply(this, [op]);
    }
    return errAsync(
      new EvaluationError(
        "No operator evaluator defined for " + op.constructor,
      ),
    );
  }

  public evalBinaryOperator(
    cond: BinaryCondition,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return ResultUtils.combine([
      this.evalAny(cond.lval),
      this.evalAny(cond.rval),
    ]).andThen(([lval, rval]) => {
      if (lval == null || rval == null) {
        return okAsync(SDQL_Return(false));
      }

      if (cond instanceof ConditionAnd) {
        return okAsync(SDQL_Return(lval && rval));
      }
      if (cond instanceof ConditionOr) {
        return okAsync(SDQL_Return(lval || rval));
      }
      if (cond instanceof ConditionE) {
        return okAsync(SDQL_Return(lval == rval));
      }
      if (cond instanceof ConditionG) {
        return okAsync(SDQL_Return(lval > rval));
      }
      if (cond instanceof ConditionGE) {
        return okAsync(SDQL_Return(lval >= rval));
      }
      if (cond instanceof ConditionL) {
        return okAsync(SDQL_Return(lval < rval));
      }
      if (cond instanceof ConditionLE) {
        return okAsync(SDQL_Return(lval <= rval));
      }
      if (cond instanceof ConditionIn) {
        return okAsync(
          SDQL_Return(
            (rval as Array<string | number | SDQL_Return>).includes(lval),
          ),
        );
      }
      return errAsync(
        new EvaluationError(
          `There is no implementation for evaluating given condition`,
        ),
      );
    });
  }

  // public evalReturn(r: AST_Return): ResultAsync<SDQL_Return, EvaluationError> {
  //   return okAsync(SDQL_Return(r.message));
  // }

  public evalPrimitiveExpr(
    expr: AST_Expr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return okAsync((expr as AST_Expr).source as SDQL_Return);
  }

  public evalSubquery(
    q: AST_Subquery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.queryRepository.get(q, this.dataPermissions);
  }
}
