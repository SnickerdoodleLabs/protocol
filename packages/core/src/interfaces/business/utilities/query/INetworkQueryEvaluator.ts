import { AST_NetworkQuery } from "@core/interfaces/objects";
import { AST_BalanceQuery } from "@core/interfaces/objects/SDQL/AST_BalanceQuery";
import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IQueryTypeEvaluator } from "./IQueryTypeEvaluator";

export interface INetworkQueryEvaluator extends IQueryTypeEvaluator {
    eval (
        query: AST_NetworkQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INetworkQueryEvaluatorType = Symbol.for("INetworkQueryEvaluator");