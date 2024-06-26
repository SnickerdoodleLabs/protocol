import {
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  IpfsCID,
  MethodSupportError,
  PersistenceError,
  PublicEvents,
  SDQL_Return,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  AST_PropertyQuery,
  AST_SubQuery,
} from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryEvaluator {
  eval(
    query: AST_SubQuery,
    queryCID: IpfsCID,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<
    SDQL_Return,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
  evalPropertyQuery(
    q: AST_PropertyQuery,
    publicEvents: PublicEvents,
    queryCID: IpfsCID,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryEvaluatorType = Symbol.for("IQueryEvaluator");
