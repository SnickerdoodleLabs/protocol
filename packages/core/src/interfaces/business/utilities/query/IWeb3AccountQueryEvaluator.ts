import {
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_Web3AccountQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IWeb3AccountQueryEvaluator {
  eval(
    query: AST_Web3AccountQuery,
    queryCID: IpfsCID,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IWeb3AccountQueryEvaluatorType = Symbol.for(
  "IWeb3AccountSizeQueryEvaluator",
);
