import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_PropertyQuery, AST_Query } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryEvaluator {
  eval(query: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
  evalPropertyQuery(
    q: AST_PropertyQuery,
  ): ResultAsync<SDQL_Return , PersistenceError>;
}

export const IQueryEvaluatorType = Symbol.for("IQueryEvaluator");
