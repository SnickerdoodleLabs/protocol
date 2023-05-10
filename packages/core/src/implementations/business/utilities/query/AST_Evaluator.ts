import {
  AdKey,
  DataPermissions,
  EvalNotImplementedError,
  EvaluationError,
  InsightKey,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_Ad,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_RequiresExpr,
  AST_ReturnsExpr,
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
import { IAdDataRepository } from "@core/interfaces/data/index.js";
import { ResultUtils } from "neverthrow-result-utils";

export class AST_Evaluator {
  readonly operatorMap = new Map<Function, Function>();
  readonly expMap = new Map<Function, Function>();

  constructor(
    readonly baseTruth?: (AdKey | InsightKey)[],
    readonly cid?: IpfsCID,
    readonly queryRepository?: IQueryRepository,
    readonly adDataRepository?: IAdDataRepository,
    readonly dataPermissions?: DataPermissions,
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
    this.expMap.set(AST_ReturnsExpr, this.evalReturnsExpr);
    this.expMap.set(AST_RequiresExpr, this.evalConditionExpr);
  }

  public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
    console.log("evalAny expr:");
    console.log(expr);
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr);
    } else if (TypeChecker.isSubQuery(expr)) {
      return this._evalSubQuery(expr);
    }
    return this.evalExpr(expr);
  }

  public evalExpr(
    expr: AST_Expr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    console.log(`evalExpr expr: `);
    console.log(expr);

    if (TypeChecker.isPrimitiveExpr(expr)) {
      console.log(`evalExpr is primitive: ` + expr);
      return okAsync(
        SDQL_Return((expr as AST_Expr).source ?? (false as SDQL_Return)),
      );
    }

    let evaluator = this.expMap.get(expr.constructor);
    if (evaluator) {
      return evaluator.apply(this, [expr]);
    }

    return errAsync(new EvalNotImplementedError(typeof expr));
  }

  public evalReturnsExpr(
    expr: AST_ReturnsExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    console.log(`evalReturnsExpr expr: `);
    console.log(expr);
    if (TypeChecker.isPrimitiveExpr(expr)) {
      console.log(`evalReturnsExpr is primitive: ` + expr);
      return okAsync(
        SDQL_Return((expr as AST_Expr).source ?? (false as SDQL_Return)),
      );
    }

    if (TypeChecker.isSubQuery(expr.source)) {
      console.log(`evalReturnsExpr is subquery`);
      // Insights must not return raw values, but its removal must be discussed first
      return this._evalSubQuery(expr.source as AST_SubQuery).map((res) => {
        console.log("evalReturnsExpr subq res: ");
        console.log(res);
        return res;
      });
    }

    if (TypeChecker.isOperator(expr.source)) {
      console.log(`evalReturnsExpr is operator`);
      return this.evalOperator(expr.source as Operator);
    }
    return errAsync(new EvalNotImplementedError(typeof expr));
  }

  public evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    console.log("evalConditionExpr expr");
    console.log(expr);
    if (TypeChecker.isSubQuery(expr.source)) {
      return this._evalSubQuery(expr.source as AST_SubQuery);
    }
    if (TypeChecker.isAd(expr.source)) {
      return this._evalAd(expr.source as AST_Ad);
    }
    if (TypeChecker.isInsight(expr.source)) {
      return this._evalInsight(expr.source as AST_Insight);
    }
    if (TypeChecker.isOperator(expr.source)) {
      return this.evalOperator(expr.source as Operator);
    }
    return errAsync<SDQL_Return, EvaluationError>(
      new EvaluationError("Condition has wrong type"),
    );
  }

  //#region operator evaluation
  public evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError> {
    console.log("evalOperator op");
    console.log(op);
    const evaluator = this.operatorMap.get(op.constructor);
    console.log("evalOperator evaluator");
    console.log(JSON.stringify(evaluator));
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

  private _evalSubQuery(
    q: AST_SubQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.queryRepository!.get(this.cid!, q, this.dataPermissions!);
  }

  private _evalInsight(
    insight: AST_Insight,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    return this.evalConditionExpr(insight.target).andThen((isTargeted) => {
      if (isTargeted == null || isTargeted == false) {
        return okAsync(SDQL_Return(null));
      }
      return this.evalReturnsExpr(insight.returns);
    });
  }

  private _evalAd(
    ad: AST_Ad,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError> {
    console.log("_evalAd ad: " + ad);
    return this.evalConditionExpr(ad.target).andThen((isTargeted) => {
      console.log("_evalAd isTargeted: " + isTargeted);
      if (isTargeted == null || isTargeted == false) {
        return okAsync(SDQL_Return(null));
      }

      

      return this.adDataRepository!.getAdSignatures().map((sigs) => {
        console.log("_evalAd adSigs: " + sigs);
        const signature = sigs.find(
          (sig) => sig.queryCID == this.cid && sig.adKey == AdKey(ad.key),
        );
        console.log("_evalAd signature: " + signature);
        if (!signature) {
          return SDQL_Return(null);
        }
        return SDQL_Return(signature);
      });
    });
  }

  private _evalOperands(
    ...vals: (ConditionOperandTypes | null)[]
  ): ResultAsync<SDQL_Return[], EvaluationError> {
    console.log("_evalOperands vals:");
    console.log(vals);
    return ResultUtils.combine(
      vals.map((val) => {
        return this.evalAny(val);
      }),
    ).map((rets) => {
      console.log("_evalOperands vals evaluated:");
      console.log(rets);
      return rets.map((ret) => {
        if (ret == null) {
          return SDQL_Return(false);
        }
        return ret;
      });
    });
  }
}
