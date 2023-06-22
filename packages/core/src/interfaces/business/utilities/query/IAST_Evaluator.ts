import {
  EvaluationError,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
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
  ConditionOr,
  Operator,
} from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IAST_Evaluator {
  eval(): ResultAsync<SDQL_Return, EvaluationError>;

  evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError>;
  evalExpr(
    expr: AST_Expr | Command_IF | Operator,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalIf(eef: Command_IF): ResultAsync<SDQL_Return, EvaluationError>;
  evalConditionExpr(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalQuery(q: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
  evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError>;
  evalAnd(cond: ConditionAnd): ResultAsync<SDQL_Return, EvaluationError>;
  evalOr(cond: ConditionOr): ResultAsync<SDQL_Return, EvaluationError>;
  evalIn(cond: ConditionIn): ResultAsync<SDQL_Return, EvaluationError>;
  evalGE(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError>;
  evalG(cond: ConditionG): ResultAsync<SDQL_Return, EvaluationError>;
  evalL(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError>;
  evalCompensationExpr(eef: any): ResultAsync<SDQL_Return, EvaluationError>;
  evalCompCondition(
    expr: AST_ConditionExpr,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalReturnExpr(
    expr: AST_ReturnExpr,
  ): ResultAsync<SDQL_Return, EvaluationError>;
  evalReturn(r: AST_Return): ResultAsync<SDQL_Return, EvaluationError>;
  evalCompensation(r: AST_Return): ResultAsync<SDQL_Return, EvaluationError>;
  evalPrimitiveExpr(expr: AST_Expr): ResultAsync<SDQL_Return, EvaluationError>;
}
