import { AST_BalanceQuery } from "@core/interfaces/objects/SDQL/AST_BalanceQuery";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IQueryTypeEvaluator } from "./IQueryTypeEvaluator";

export interface IBalanceQueryEvaluator extends IQueryTypeEvaluator {
    eval (
        query: AST_BalanceQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IBalanceQueryEvaluatorType = Symbol.for("IBalanceQueryEvaluator");