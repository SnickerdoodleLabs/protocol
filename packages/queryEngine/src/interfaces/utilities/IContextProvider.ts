import { QueryEngineContext } from "@query-engine/interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IContextProvider {
    getContext(): ResultAsync<QueryEngineContext, never>;
    setContext(context: QueryEngineContext): ResultAsync<void, never>
}

export const IContextProviderType = Symbol.for("IContextProvider");
