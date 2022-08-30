import { AST_Query } from "@core/interfaces/objects";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryTypeEvaluator {
  
  eval (
    query: AST_Query
  ): ResultAsync<SDQL_Return, PersistenceError>;
  
}