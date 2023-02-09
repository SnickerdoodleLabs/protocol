import { IWeb3QueryEvaluator } from "@core/interfaces/business/utilities/query/IWeb3QueryEvaluator";
import {  AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INftQueryEvaluator extends IWeb3QueryEvaluator {
    eval (
        query: AST_NftQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INftQueryEvaluatorType = Symbol.for("INftQueryEvaluator");