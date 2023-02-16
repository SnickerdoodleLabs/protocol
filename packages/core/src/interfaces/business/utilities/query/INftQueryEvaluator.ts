import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INftQueryEvaluator {
  eval(query: AST_NftQuery): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INftQueryEvaluatorType = Symbol.for("INftQueryEvaluator");
