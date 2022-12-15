import { AST_BalanceQuery, IQueryTypeEvaluator } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBalanceQueryEvaluator extends IQueryTypeEvaluator {
  eval(query: AST_BalanceQuery): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBalanceQueryEvaluatorType = Symbol.for("IBalanceQueryEvaluator");
