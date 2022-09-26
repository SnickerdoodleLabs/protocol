import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_Query } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryTypeEvaluator {
  eval(query: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
}
