import {
  EvalNotImplementedError,
  EvaluationError,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IQueryRepository } from "@core/interfaces/business/utilities";
import {
  AST,
  AST_ConditionExpr,
  AST_Expr,
  AST_Query,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionOr,
  Operator,
  TypeChecker,
} from "@core/interfaces/objects";
export class AST_Evaluator {
  /**
   * @remarks This class should not be instantiated directly. Use the AST_Factories instead.
   */

  readonly operatorMap = new Map<any, Function>();
  readonly expMap = new Map<any, Function>();

  constructor(
    readonly cid: IpfsCID,
    readonly ast: AST | null,
    readonly queryRepository: IQueryRepository,
  ) {
    this.operatorMap.set(ConditionAnd, this.evalAnd);
    this.operatorMap.set(ConditionOr, this.evalOr);
    this.operatorMap.set(ConditionIn, this.evalIn);
    this.operatorMap.set(ConditionGE, this.evalGE);
    this.operatorMap.set(ConditionL, this.evalL);

    this.expMap.set(Command_IF, this.evalIf);
    this.expMap.set(AST_ConditionExpr, this.evalConditionExpr);
    this.expMap.set(AST_ReturnExpr, this.evalReturnExpr);
    this.expMap.set(Operator, this.evalOperator);
  }

  public eval(): ResultAsync<SDQL_Return, EvaluationError> {
    return errAsync(new EvaluationError("Not implemented"));
  }

  public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
    // console.log("evalAny", expr);
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr);
    } else if (TypeChecker.isQuery(expr)) {
      return this.evalQuery(expr);
    } else {
      return this.evalExpr(expr);
    }
  }

  public evalExpr(
    expr: AST_Expr | Command_IF | Operator,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    /**
     * Based on different types of expressions,
     * it calls the right function to evaluate one and return the value
     */

    if (TypeChecker.isPrimitiveExpr(expr)) {
      const val = SDQL_Return((expr as AST_Expr).source as SDQL_Return);
      return okAsync(val);
    } else {
      const evaluator = this.expMap.get(expr.constructor);

      if (evaluator) {
        const val = evaluator.apply(this, [expr]); // Always returns ResultAsync
        return val;
      } else {
        return errAsync(new EvalNotImplementedError(typeof expr));
      }
    }
  }

  public evalIf(eef: Command_IF): ResultAsync<SDQL_Return, EvaluationError> {
    // 1. evaluate conditionExpr
    // 2. if true, evaluate TrueExpr
    // 3. if false, evaluate FalseExpr

    // 1. we need the value here.
    const condResult = this.evalConditionExpr(eef.conditionExpr);
    return condResult.andThen(
      (val): ResultAsync<SDQL_Return, EvaluationError> => {
        if (val == true) {

          const trueResult = this.evalExpr(eef.trueExpr);
          return trueResult;

        } else {

          if (eef.falseExpr) {
            return this.evalExpr(eef.falseExpr);
          }
          return errAsync(
            new EvaluationError(`if ${eef.name} do not have a falseExpr`),
          );
          
        }
      },
    );
  }

  public evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {

    const condResult: ResultAsync<SDQL_Return, EvaluationError> | null = null;
    if (TypeChecker.isQuery(expr.source)) {
      
      return this.evalQuery(expr.source as AST_Query);

    } else if (TypeChecker.isOperator(expr.source)) {

      return this.evalOperator(expr.source as Operator);

    } else {

      return errAsync<SDQL_Return, EvaluationError>(
        new TypeError("Condition has wrong type"),
      );
      
    }
  }

  public evalQuery(q: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
    // console.log(q);
    /**
     * It sends the query to the Query Repository
     */

    return this.queryRepository.get(this.cid, q);
  }

  //#region operator evaluation

  public evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError> {
    const evaluator = this.operatorMap.get(op.constructor);
    // console.log("Evaluating", op);
    // console.log("with", evaluator);
    if (evaluator) {
      return evaluator.apply(this, [op]);
    } else {
      return errAsync(
        new EvaluationError(
          "No operator evaluator defined for " + op.constructor,
        ),
      );
    }
  }

  public evalAnd(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    // console.log(this);
    const left = this.evalAny(cond.lval);

    return left.andThen((lval) => {
      if (lval == false) {
        return okAsync(SDQL_Return(false));
      } else {
        return this.evalAny(cond.rval).andThen((rval) => {
          return okAsync(rval);
        });
      }
    });
  }

  public evalOr(cond: ConditionOr): ResultAsync<SDQL_Return, EvaluationError> {
    const left = this.evalAny(cond.lval);

    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      if (lval == true) {
        return okAsync(SDQL_Return(true));
      } else {
        const right = this.evalAny(cond.rval);
        return right.andThen(
          (rval): ResultAsync<SDQL_Return, EvaluationError> => {
            if (rval == true) {
              return okAsync(SDQL_Return(true));
            } else {
              return okAsync(SDQL_Return(false));
            }
          },
        );
      }
    });
  }

  public evalIn(cond: ConditionIn): ResultAsync<SDQL_Return, EvaluationError> {
    const left = this.evalAny(cond.lval);

    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      const right = this.evalAny(cond.rvals);
      return right.andThen(
        (rvals): ResultAsync<SDQL_Return, EvaluationError> => {
          // console.log('left', lval);
          // console.log('right', rvals);
          return okAsync(SDQL_Return((rvals as Array<any>).includes(lval)));
        },
      );
    });
  }

  public evalGE(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError> {
    const left = this.evalAny(cond.lval);
    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      const right = this.evalAny(cond.rval);
      return right.andThen(
        (rval): ResultAsync<SDQL_Return, EvaluationError> => {
          return okAsync(SDQL_Return(lval >= rval));
        },
      );
    });
  }

  public evalG(cond: ConditionG): ResultAsync<SDQL_Return, EvaluationError> {
    const left = this.evalAny(cond.lval);
    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      const right = this.evalAny(cond.rval);
      return right.andThen(
        (rval): ResultAsync<SDQL_Return, EvaluationError> => {
          return okAsync(SDQL_Return(lval > rval));
        },
      );
    });
  }

  public evalL(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError> {
    const left = this.evalAny(cond.lval);
    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      const right = this.evalAny(cond.rval);
      return right.andThen(
        (rval): ResultAsync<SDQL_Return, EvaluationError> => {
          return okAsync(SDQL_Return(lval < rval));
        },
      );
    });
  }

  //#endregion

  public evalReturnExpr(
    expr: AST_ReturnExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (TypeChecker.isQuery(expr.source)) {
      //return this.evalQuery((expr.source) as AST_Query);
      // console.log(this);
      return this.evalQuery(expr.source as AST_Query).andThen((val) => {
        return okAsync(val);
      });
    }

    return this.evalReturn((expr as AST_ReturnExpr).source as AST_Return);
  }
  public evalReturn(r: AST_Return): ResultAsync<SDQL_Return, EvaluationError> {
    return okAsync(SDQL_Return(r.message));
  }

  public evalPrimitiveExpr(
    expr: AST_Expr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return okAsync((expr as AST_Expr).source as SDQL_Return);
  }
}
