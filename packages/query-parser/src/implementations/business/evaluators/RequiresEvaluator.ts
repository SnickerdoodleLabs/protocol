import {
  IpfsCID,
  DataPermissions,
  HexString32,
  SDQL_Name,
  EvaluationError,
  SDQL_Return,
  PersistenceError,
  EvalNotImplementedError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { utils } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@query-parser/implementations/business/evaluators/AST_Evaluator.js";
import { CachedQueryRepository } from "@query-parser/implementations/utilities/CachedQueryRepository.js";
import { TypeChecker } from "@query-parser/implementations/utilities/TypeChecker.js";
import {
  AST_Ad,
  AST_Expr,
  AST_Insight,
  AST_SubQuery,
  Command_IF,
  Operator,
} from "@query-parser/interfaces/index.js";
import { AST_RequireExpr } from "@query-parser/interfaces/objects/AST_RequireExpr.js";

export class RequiresEvaluator extends AST_Evaluator {
  constructor(readonly availableMap: Map<SDQL_Name, unknown>) {
    const queryRepo = new CachedQueryRepository(new Map()); // a blank query repository
    const permissions = new DataPermissions(DataPermissions.permissionString);
    super(IpfsCID("TestCID"), queryRepo, permissions, UnixTimestamp(1));
  }

  public evalAny(
    expr: unknown,
  ): ResultAsync<
    SDQL_Return,
    EvaluationError | PersistenceError | EvalNotImplementedError
  > {
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr as SDQL_Return);
    } else if (TypeChecker.isSubQuery(expr)) {
      return this.evalSubQuery(expr as AST_SubQuery);
    } else if (TypeChecker.isAd(expr)) {
      return this.evalAdAvailability(expr as AST_Ad);
    } else if (TypeChecker.isInsight(expr)) {
      return this.evalInsightAvailability(expr as AST_Insight);
    }
    return this.evalExpr(expr as AST_Expr | Command_IF | Operator);
  }

  public eval(
    ast: AST_RequireExpr,
  ): ResultAsync<
    SDQL_Return,
    EvaluationError | PersistenceError | EvalNotImplementedError
  > {
    if (TypeChecker.isOperator(ast.source)) {
      return this.evalOperator(ast.source as Operator);
    } else {
      return this.evalAny(ast.source);
    }
  }

  protected evalAdAvailability(
    expr: AST_Ad,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (this.availableMap.get(expr.name) != null) {
      return okAsync(SDQL_Return(true));
    } else {
      return okAsync(SDQL_Return(false));
    }
  }

  protected evalInsightAvailability(
    expr: AST_Insight,
  ): ResultAsync<SDQL_Return, EvaluationError> {
    if (this.availableMap.get(expr.name) != null) {
      return okAsync(SDQL_Return(true));
    } else {
      return okAsync(SDQL_Return(false));
    }
  }
}
