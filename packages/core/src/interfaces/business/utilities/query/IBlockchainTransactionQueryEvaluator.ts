import { PersistenceError, PublicEvents, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IBlockchainTransactionQueryEvaluator {
  eval(
    query: AST_BlockchainTransactionQuery,
    publicEvents  : PublicEvents
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBlockchainTransactionQueryEvaluatorType = Symbol.for(
  "IBlockchainTransactionQueryEvaluator",
);
