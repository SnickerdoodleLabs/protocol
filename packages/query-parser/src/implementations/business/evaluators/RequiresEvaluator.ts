import {
  IpfsCID,
  DataPermissions,
  HexString32,
  SDQL_Name,
  EvaluationError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { utils } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@query-parser/implementations/business/evaluators/AST_Evaluator.js";
import { CachedQueryRepository } from "@query-parser/implementations/utilities/CachedQueryRepository.js";
import {
  AST_Ad,
  AST_Expr,
  AST_Insight,
  AST_SubQuery,
  Command_IF,
  Operator,
} from "@query-parser/interfaces/index.js";
import { AST_RequireExpr } from "@query-parser/interfaces/objects/AST_RequireExpr.js";
import { TypeChecker } from "@query-parser/interfaces/objects/TypeChecker.js";

export class RequiresEvaluator extends AST_Evaluator {
  constructor(readonly availableMap: Map<SDQL_Name, unknown>) {
    const queryRepo = new CachedQueryRepository(new Map()); // a blank query repository
    const permString =
      "0x111111111111111111111111111111111111111111111111111111111111111b"; // 31 ones
    const permissions = new DataPermissions(HexString32(permString));
    super(IpfsCID(""), queryRepo, permissions);
  }

  public evalAny(expr: unknown): ResultAsync<SDQL_Return, EvaluationError> {
    if (expr === undefined) {
      return errAsync(new EvaluationError("undefined expression"));
    }
    if (TypeChecker.isValue(expr)) {
      return okAsync(expr as SDQL_Return);
    } else if (TypeChecker.isSubQuery(expr)) {
      return this.evalSubQuery(expr as AST_SubQuery);
    } else if (TypeChecker.isAd(expr)) {
      if (this.availableMap.get((expr as AST_Ad).name) != null) {
        return okAsync(SDQL_Return(true));
      } else {
        return okAsync(SDQL_Return(false));
      }
    } else if (TypeChecker.isInsight(expr)) {
      if (this.availableMap.get((expr as AST_Insight).name) != null) {
        return okAsync(SDQL_Return(true));
      } else {
        return okAsync(SDQL_Return(false));
      }
    }
    return this.evalExpr(expr as AST_Expr | Command_IF | Operator);
  }

  public eval(ast: AST_RequireExpr): ResultAsync<SDQL_Return, EvaluationError> {
    return this.evalAny(ast.source);
  }
}
