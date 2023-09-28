import { IpfsCID, PersistenceError, PublicEvents, SDQL_Return } from "@snickerdoodlelabs/objects";
import {
  AST_PropertyQuery,
  AST_SubQuery,
} from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryEvaluator {
  eval(query: AST_SubQuery, queryCID : IpfsCID): ResultAsync<SDQL_Return, PersistenceError>;
  evalPropertyQuery(
    q: AST_PropertyQuery,
    publicEvents : PublicEvents,
    queryCID : IpfsCID
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryEvaluatorType = Symbol.for("IQueryEvaluator");
