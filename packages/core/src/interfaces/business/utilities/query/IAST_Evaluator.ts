import {
  EvaluationError,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_SubQuery,
  Command_IF,
  ConditionAnd,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionOr,
  Operator,
} from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IAST_Evaluator {
  evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError>;
  evalExpr(
    expr: AST_Expr | Command_IF | Operator,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalIf(
    eef: Command_IF,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalSubQuery(q: AST_SubQuery): ResultAsync<SDQL_Return, PersistenceError>;
  evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError>;
  evalAnd(
    cond: ConditionAnd,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalOr(
    cond: ConditionOr,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalIn(
    cond: ConditionIn,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalGE(
    cond: ConditionGE,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalG(
    cond: ConditionG,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalL(
    cond: ConditionGE,
  ): ResultAsync<SDQL_Return, EvaluationError | PersistenceError>;
  evalCompensationExpr(eef: any): ResultAsync<SDQL_Return, EvaluationError>;
  evalCompCondition(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalPrimitiveExpr(expr: AST_Expr): ResultAsync<SDQL_Return, EvaluationError>;
}
