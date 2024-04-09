import {
  IpfsCID,
  PersistenceError,
  PublicEvents,
  SDQL_Return,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IBlockchainTransactionQueryEvaluator {
  eval(
    query: AST_BlockchainTransactionQuery,
    queryCID: IpfsCID,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBlockchainTransactionQueryEvaluatorType = Symbol.for(
  "IBlockchainTransactionQueryEvaluator",
);
