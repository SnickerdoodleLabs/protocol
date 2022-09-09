import { AST_Query } from "@query-parser/interfaces";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryTypeEvaluator {
  
  eval (
    query: AST_Query
  ): ResultAsync<SDQL_Return, PersistenceError>;
  
}