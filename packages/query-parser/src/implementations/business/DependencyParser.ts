import {
  AST_RequireExpr,
  AST_SubQuery,
  TypeChecker,
  AST_ConditionExpr,
  AST_Expr,
  BinaryCondition,
  AST_Ad,
  AST_Insight,
} from "@query-parser/interfaces";
import { AdKey, InsightKey, MissingASTError } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export class DependencyParser {
  public possibleInsightsAndAds: (InsightKey | AdKey)[] | undefined;

  keyExists(insightOrAdKey: InsightKey | AdKey): boolean {
    if (this.possibleInsightsAndAds) {
      return this.possibleInsightsAndAds.includes(insightOrAdKey);
    }
    return true;
  }

  public getQueryDependencies(
    expr: AST_RequireExpr,
    possibleInsightsAndAds?: (InsightKey | AdKey)[],
  ): ResultAsync<Set<AST_SubQuery>, MissingASTError> {
    if (expr === null) {
      return errAsync(new MissingASTError("Null expr"));
    }
    this.possibleInsightsAndAds = possibleInsightsAndAds;

    if (TypeChecker.isInsight(expr.source)) {
      return okAsync(
        new Set(
          this.getAstConditionExprDependencies(
            expr.source.target,
            expr.source.returns,
          ),
        ),
      );
    }
    if (TypeChecker.isAd(expr.source)) {
      return okAsync(
        new Set(this.getAstConditionExprDependencies(expr.source.target)),
      );
    }
    if (TypeChecker.isBinaryCondition(expr.source)) {
      return okAsync(new Set(this.getBinaryConditionDependencies(expr.source)));
    }
    if (TypeChecker.isCommandIf(expr.source)) {
      return okAsync(
        new Set(this.getAstExprDependencies(expr.source.conditionExpr)),
      );
    }

    return errAsync(new MissingASTError("Invalid expr"));
  }
  private getAstConditionExprDependencies(
    expr: AST_ConditionExpr,
    returns?: AST_Expr,
  ): AST_SubQuery[] {
    const queries: AST_SubQuery[] = [];
    this.checkSubqueryAndAddDependencies(expr.source, queries);
    this.checkBinaryConditionAndAddDependencies(expr.source, queries);
    if (TypeChecker.isBoolean(expr.source) && returns) {
      queries.push(...this.getAstExprDependencies(returns));
    }
    return queries;
  }
  private getAstExprDependencies(expr: AST_Expr): AST_SubQuery[] {
    const queries: AST_SubQuery[] = [];
    this.checkSubqueryAndAddDependencies(expr.source, queries);
    this.checkAdAndAddDependencies(expr.source, queries);
    this.checkInsightAndAddDependencies(expr.source, queries);
    this.checkBinaryConditionAndAddDependencies(expr.source, queries);
    return queries;
  }

  private getBinaryConditionDependencies(
    expr: BinaryCondition,
  ): AST_SubQuery[] {
    const queries: AST_SubQuery[] = [];

    this.checkSubqueryAndAddDependencies(expr.lval, queries);
    this.checkSubqueryAndAddDependencies(expr.rval, queries);

    this.checkIsConditionAndAddDependencies(expr.lval, queries);
    this.checkIsConditionAndAddDependencies(expr.rval, queries);

    this.checkInsightAndAddDependencies(expr.lval, queries);
    this.checkInsightAndAddDependencies(expr.rval, queries);

    this.checkAdAndAddDependencies(expr.lval, queries);
    this.checkAdAndAddDependencies(expr.rval, queries);
    return queries;
  }

  private checkAdAndAddDependencies(
    expr: AST_Ad | any,
    queries: AST_SubQuery[],
  ) {
    if (TypeChecker.isAd(expr)) {
      if (this.keyExists(AdKey(expr.key))) {
        queries.push(...this.getAstConditionExprDependencies(expr.target));
      }
    }
  }
  private checkInsightAndAddDependencies(
    expr: AST_Insight | any,
    queries: AST_SubQuery[],
  ) {
    if (TypeChecker.isInsight(expr)) {
      if (this.keyExists(InsightKey(expr.name))) {
        queries.push(
          ...this.getAstConditionExprDependencies(expr.target, expr.returns),
        );
      }
    }
  }
  private checkIsConditionAndAddDependencies(
    expr: AST_ConditionExpr | any,
    queries: AST_SubQuery[],
  ) {
    if (TypeChecker.isConditionExpr(expr)) {
      queries.push(...this.getAstConditionExprDependencies(expr));
    }
  }
  private checkBinaryConditionAndAddDependencies(
    expr: BinaryCondition | any,
    queries: AST_SubQuery[],
  ) {
    if (TypeChecker.isBinaryCondition(expr)) {
      queries.push(...this.getBinaryConditionDependencies(expr));
    }
  }
  private checkSubqueryAndAddDependencies(
    expr: AST_SubQuery | any,
    queries: AST_SubQuery[],
  ) {
    if (TypeChecker.isSubQuery(expr)) {
      queries.push(expr);
    }
  }
}
