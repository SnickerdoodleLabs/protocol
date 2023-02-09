import { IQueryTypeEvaluator } from "@core/interfaces/business/utilities/query/IQueryTypeEvaluator";
import { AST_Web3Query } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWeb3QueryEvaluator extends IQueryTypeEvaluator {
    eval (
        query: AST_Web3Query
    ): ResultAsync<SDQL_Return, PersistenceError>;

    
}

export const IWeb3QueryEvaluatorType = Symbol.for("IWeb3QueryEvaluator");