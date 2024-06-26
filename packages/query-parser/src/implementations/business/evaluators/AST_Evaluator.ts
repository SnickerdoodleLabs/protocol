import {
  AccountIndexingError,
  AjaxError,
  DataPermissions,
  EvalNotImplementedError,
  EvaluationError,
  InvalidParametersError,
  IpfsCID,
  MethodSupportError,
  PersistenceError,
  SDQL_Return,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  AST_ConditionExpr,
  AST_Expr,
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
  IQueryRepository,
  AST_Insight,
  AST_QuestionnaireQuery,
} from "@query-parser/interfaces/index.js";

export class AST_Evaluator {
  readonly operatorMap = new Map<Function, Function>();
  readonly expMap = new Map<Function, Function>();

  constructor(
    readonly cid: IpfsCID,
    readonly queryRepository: IQueryRepository,
    readonly dataPermissions: DataPermissions,
    readonly queryTimestamp: UnixTimestamp,
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

  public evalAny(
    expr: any,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
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
  ): ResultAsync<SDQL_Return, EvaluationError | EvalNotImplementedError> {
    if (TypeChecker.isPrimitiveExpr(expr)) {
      return okAsync(
        SDQL_Return((expr as AST_Expr).source ?? (false as SDQL_Return)),
      );
    } else if (TypeChecker.isOperator(expr)) {
      return this.evalOperator(expr as Operator);
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
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
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

  public evalIf(
    eef: Command_IF,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
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
  ): ResultAsync<
    SDQL_Return,
    | PersistenceError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.queryRepository.get(
      this.cid,
      q,
      this.dataPermissions,
      this.queryTimestamp,
    );
  }

  /***
   * comparison operators keeps nulls as nulls
   */
  public evalComparisonOperands(
    vals: (ConditionOperandTypes | null)[],
  ): ResultAsync<
    SDQL_Return[],
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine(
      vals.map((val) => {
        return this.evalAny(val);
      }),
    );
  }

  /***
   * Returns false if an operand is null or false. Returns true otherwise
   */
  public evalLogicalOperands(
    vals: (ConditionOperandTypes | null)[],
  ): ResultAsync<
    SDQL_Return[],
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine(
      vals.map((val) => {
        return this.evalAny(val);
      }),
    ).map((vals) => {
      return vals.map((val) => {
        if (val == null) {
          return SDQL_Return(false);
        }

        if (val !== false) {
          return SDQL_Return(true);
        }
        return val;
      });
    });
  }

  public evalInsight(
    ast: AST_Insight,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalAny(ast.target).andThen((targetFulfilled) => {
      if (targetFulfilled) {
        return this.evalAny(ast.returns.source);
      }
      return okAsync(SDQL_Return(null));
    });
  }

  private evalAnd(
    cond: ConditionAnd,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalLogicalOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval && rval);
      },
    );
  }
  private evalOr(
    cond: ConditionOr,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalLogicalOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval || rval);
      },
    );
  }
  private evalE(
    cond: ConditionE,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval == rval);
      },
    );
  }
  private evalG(
    cond: ConditionG,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval > rval);
      },
    );
  }
  private evalGE(
    cond: ConditionGE,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval >= rval);
      },
    );
  }
  private evalL(
    cond: ConditionL,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval < rval);
      },
    );
  }
  private evalLE(
    cond: ConditionLE,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(lval <= rval);
      },
    );
  }
  private evalIn(
    cond: ConditionIn,
  ): ResultAsync<
    SDQL_Return,
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.evalComparisonOperands([cond.lval, cond.rval]).map(
      ([lval, rval]) => {
        return SDQL_Return(
          (rval as Array<string | number | SDQL_Return>).includes(lval),
        );
      },
    );
  }
}
