import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { 
    IQueryTypeEvaluator,
    AST_NetworkQuery
} from "@snickerdoodlelabs/query-parser";

export interface INetworkQueryEvaluator extends IQueryTypeEvaluator {
    eval (
        query: AST_NetworkQuery
    ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INetworkQueryEvaluatorType = Symbol.for("INetworkQueryEvaluator");