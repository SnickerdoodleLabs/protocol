import { AST_BalanceQuery } from "@snickerdoodlelabs/query-parser";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IQueryTypeEvaluator } from "@core/interfaces/business/utilities/query/IQueryTypeEvaluator";

export interface IBalanceQueryEvaluator extends IQueryTypeEvaluator {
    eval (
        query: AST_BalanceQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBalanceQueryEvaluatorType = Symbol.for("IBalanceQueryEvaluator");