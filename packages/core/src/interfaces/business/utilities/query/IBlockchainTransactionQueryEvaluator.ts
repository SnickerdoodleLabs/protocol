import { IWeb3QueryEvaluator } from "@core/interfaces/business/utilities/query/IWeb3QueryEvaluator";
import { AST_BlockchainTransactionQuery } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainTransactionQueryEvaluator extends IWeb3QueryEvaluator {
    eval (
        query: AST_BlockchainTransactionQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBlockchainTransactionQueryEvaluatorType = Symbol.for("IBlockchainTransactionQueryEvaluator");