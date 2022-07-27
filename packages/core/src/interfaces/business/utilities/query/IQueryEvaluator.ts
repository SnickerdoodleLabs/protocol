import { AST_NetworkQuery, AST_PropertyQuery, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryEvaluator {
    evalNetworkQuery(q: AST_NetworkQuery): ResultAsync<SDQL_Return, PersistenceError>;
    evalPropertyQuery(q: AST_PropertyQuery): ResultAsync<SDQL_Return, PersistenceError>
}

export const IQueryEvaluatorType = Symbol.for("IQueryEvaluator");