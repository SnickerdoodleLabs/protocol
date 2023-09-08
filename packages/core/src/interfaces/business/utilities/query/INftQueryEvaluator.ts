import {
  PersistenceError,
  PublicEvents,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface INftQueryEvaluator {
  eval(
    query: AST_NftQuery,
    publicEvents: PublicEvents,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INftQueryEvaluatorType = Symbol.for("INftQueryEvaluator");
