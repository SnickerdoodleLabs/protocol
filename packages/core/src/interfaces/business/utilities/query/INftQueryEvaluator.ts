import {
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  IpfsCID,
  MethodSupportError,
  PersistenceError,
  SDQL_Return,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface INftQueryEvaluator {
  eval(
    query: AST_NftQuery,
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
}

export const INftQueryEvaluatorType = Symbol.for("INftQueryEvaluator");
