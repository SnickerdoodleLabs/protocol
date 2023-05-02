import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_Subquery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryTypeEvaluator {
  eval(query: AST_Subquery): ResultAsync<SDQL_Return, PersistenceError>;
}
