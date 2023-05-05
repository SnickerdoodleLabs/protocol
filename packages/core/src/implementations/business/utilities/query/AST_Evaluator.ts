import {
  DataPermissions,
  EvalNotImplementedError,
  EvaluationError,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_RequiresExpr,
  AST_SubQuery,
  Command_IF,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
  ConditionOperandTypes,
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
    readonly cid: IpfsCID,
    readonly queryRepository: IQueryRepository,
    readonly dataPermissions: DataPermissions,
  ) {
    this.operatorMap.set(ConditionAnd, this.evalAnd);
    this.operatorMap.set(ConditionOr, this.evalOr);
    this.operatorMap.set(ConditionE, this.evalE);
    this.operatorMap.set(ConditionG, this.evalG);
    this.operatorMap.set(ConditionGE, this.evalGE);
    this.operatorMap.set(ConditionL, this.evalL);
    this.operatorMap.set(ConditionLE, this.evalLE);
    this.operatorMap.set(ConditionIn, this.evalIn);

    this.expMap.set(Operator, this.evalOperator);
    this.expMap.set(AST_ConditionExpr, this.evalConditionExpr);
  }

  public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr);
    } else if (TypeChecker.isSubQuery(expr)) {
      return this.evalSubQuery(expr);
    }
    return this.evalExpr(expr);
  }

  public evalExpr(
    expr: AST_Expr | Command_IF | Operator,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    console.log(`evalExpr expr: `);
    console.log(expr);
    if (TypeChecker.isPrimitiveExpr(expr)) {
      console.log(`evalExpr is primitive: ` + expr);
      return okAsync(
        SDQL_Return((expr as AST_Expr).source ?? (false as SDQL_Return)),
      );
    } else {
      const evaluator = this.expMap.get(expr.constructor);
      console.log(`evalExpr with evaluator: `);
      console.log(evaluator);
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
    if (TypeChecker.isSubQuery(expr.source)) {
      return this.evalSubQuery(expr.source as AST_SubQuery);
    } else if (TypeChecker.isOperator(expr.source)) {
      return this.evalOperator(expr.source as Operator);
    } else {
      return errAsync<SDQL_Return, EvaluationError>(
        new EvaluationError("Condition has wrong type"),
      );
    }
  }

  public evalRequiresExpr(
    expr: AST_RequiresExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (TypeChecker.isInsight(expr.source)) {
      return this.evalSubQuery(expr.source as AST_SubQuery);
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
  private evalAnd(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval && rval);
    });
  }
  private evalOr(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval || rval);
    });
  }
  private evalE(cond: ConditionAnd): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval == rval);
    });
  }
  private evalG(cond: ConditionAnd): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval > rval);
    });
  }
  private evalGE(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval >= rval);
    });
  }
  private evalL(cond: ConditionAnd): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval < rval);
    });
  }
  private evalLE(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(lval <= rval);
    });
  }
  private evalIn(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this._evalOperands(cond.lval, cond.rval).map(([lval, rval]) => {
      return SDQL_Return(
        (rval as Array<string | number | SDQL_Return>).includes(lval),
      );
    });
  }

  public evalIf(eef: Command_IF): ResultAsync<SDQL_Return, EvaluationError> {
    return this.evalAny(eef.conditionExpr).andThen((val) => {
      if (val == true) {
        return this.evalExpr(eef.trueExpr);
      } else if (!eef.falseExpr) {
        return errAsync(
          new EvaluationError(`if ${eef.name} do not have a falseExpr`),
        );
      }
      return this.evalExpr(eef.falseExpr);
    });
  }

  public evalPrimitiveExpr(
    expr: AST_Expr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return okAsync((expr as AST_Expr).source as SDQL_Return);
  }

  public evalSubQuery(
    q: AST_SubQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.queryRepository.get(this.cid, q, this.dataPermissions);
  }

  private _evalOperands(
    ...vals: (ConditionOperandTypes | null)[]
  ): ResultAsync<SDQL_Return[], EvaluationError> {
    return ResultUtils.combine(
      vals.map((val) => {
        return this.evalAny(val);
      }),
    ).map((vals) => {
      return vals.map((val) => {
        if (val == null) {
          return SDQL_Return(false);
        }
        return val;
      });
    });
  }
}
