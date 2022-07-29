import {
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

import { QueryRepository } from "./QueryRepository";

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
  EvalNotImplementedError,
  EvaluationError,
  Operator,
  TypeChecker,
} from "@core/interfaces/objects";

// TODO introduce dependency injection

export class AST_Evaluator {
  /**
   * @remarks This class should not be instantiated directly. Use the AST_Factories instead.
   */

  // readonly queryRepository: QueryRepository = new QueryRepository();
  // readonly exprMap: Map<AST_Expr.name
  //                     | typeof AST_Query
  //                     | typeof Condition
  //                     | typeof Command_IF,
  //                     Function> = new Map<AST_Expr.name
  //                                     | typeof AST_Query
  //                                     | typeof Condition
  //                                     | typeof Command_IF,
  //                                     Function>();

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

  postConstructor() {
    /**
     * This function must be called after construction. Otherwise the object will not be initialized correctly.
     */
    // this.operatorMap.set(ConditionAnd, this.evalAnd)
    // this.operatorMap.set(ConditionOr, this.evalOr)
    // this.operatorMap.set(ConditionIn, this.evalIn)
    // this.operatorMap.set(ConditionGE, this.evalGE)
    // this.operatorMap.set(ConditionL, this.evalL)
    // this.expMap.set(Command_IF, this.evalIf);
    // this.expMap.set(AST_ConditionExpr, this.evalConditionExpr);
    // this.expMap.set(AST_ReturnExpr, this.evalReturnExpr);
    // this.expMap.set(Operator, this.evalOperator);
    // this.expMap.set(isPrimitiveExpr, this.evalPrimitiveExpr);
  }

  public eval(): ResultAsync<SDQL_Return, EvaluationError> {
    return errAsync(new EvaluationError("Not implemented"));
  }

  public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr);
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
          // console.log('trueResult', trueResult);

          // return trueResult.andThen((val) => okAsync(val));
          // console.log('trueResult', trueResult);
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

    // condResult.then((x) => {

    //     if (x.isErr()) {
    //         throw new EvaluationError(`if ${eef.name} did not resolve to a value`);
    //         // return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
    //     }
    //     // if (x.isErr()) {
    //     //     return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
    //     // } else if (x.value) {
    //     //     return this.evalExpr(eef.trueExpr)
    //     // }

    // });

    // condResult.then((res: Result<SDQL_Return, Error>) => {
    //     if (res.isErr()) {
    //         return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
    //     } else {
    //         return res;
    //     }
    // })

    // if (condResult) {
    //     return this.evalExpr(eef.trueExpr)
    // } else {

    //     if (eef.falseExpr)
    //         return this.evalExpr(eef.falseExpr)

    // }

    // return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
  }

  public evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    const condResult: ResultAsync<SDQL_Return, EvaluationError> | null = null;
    if (TypeChecker.isQuery(expr.source)) {
      // return this.evalQuery(expr.source as AST_Query).andThen(
      //     (val: ResultAsync<SDQL_Return, EvaluationError>) =>
      //     {
      //         return okAsync(val);
      //     }
      // );
      return this.evalQuery(expr.source as AST_Query);
    } else if (TypeChecker.isOperator(expr.source)) {
      return this.evalOperator(expr.source as Operator);
      // condResult = this.evalOperator(expr.source as Operator);
      // return okAsync(condResult);
      /*
            return this.evalOperator(expr.source as Operator).andThen(
                (val: ResultAsync<SDQL_Return, EvaluationError>) =>
                {
                    return okAsync(val);
                }
            );
            */
    } else {
      return errAsync<SDQL_Return, EvaluationError>(
        new TypeError("Condition has wrong type"),
      );
      // throw new TypeError("If condition has wrong type");
    }
  }

  public evalQuery(q: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
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
      throw new Error("No operator evaluator defined for " + op.constructor);
    }
  }

  // public async evalAnd(cond: ConditionAnd): Promise<ResultAsync<SDQL_Return, EvaluationError>> {

  //     // console.log(this);
  //     const left = await this.evalAny(cond.lval);
  //     if (left.isErr()) {
  //         return errAsync(new EvaluationError(cond.name));
  //     }

  //     // left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
  //     //     if (lval == false) {
  //     //         return okAsync(SDQL_Return(false));
  //     //     } else {
  //     //         const right = this.evalAny(cond.rval);
  //     //         return right.andThen((rval): ResultAsync<SDQL_Return, EvaluationError> => {

  //     //             if (rval == false) {
  //     //                 return okAsync(SDQL_Return(false));
  //     //             } else {
  //     //                 return okAsync(SDQL_Return(true));
  //     //             }
  //     //         });
  //     //     }
  //     // });

  //     if (left.value == false) {
  //         return left;
  //     }

  //     const right = await this.evalAny(cond.rval);
  //     if (right.isErr()) {
  //         return errAsync(new EvaluationError(cond.name));
  //     }

  //     if (right.value == false) {
  //         return right;
  //     }

  //     // console.log('evalAnd', `left is ${left} and right is ${right}`);
  //     return okAsync(SDQL_Return(left.value && right.value)) ;
  // }
  public evalAnd(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    // console.log(this);
    const left = this.evalAny(cond.lval);

    return left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
      if (lval == false) {
        return okAsync(SDQL_Return(false));
      } else {
        const right = this.evalAny(cond.rval);
        return right.andThen(
          (rval): ResultAsync<SDQL_Return, EvaluationError> => {
            if (rval == false) {
              return okAsync(SDQL_Return(false));
            } else {
              return okAsync(SDQL_Return(true));
            }
          },
        );
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
