import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainTransactionQueryEvaluator {
  eval(
    query: AST_BlockchainTransactionQuery,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBlockchainTransactionQueryEvaluatorType = Symbol.for(
  "IBlockchainTransactionQueryEvaluator",
);
