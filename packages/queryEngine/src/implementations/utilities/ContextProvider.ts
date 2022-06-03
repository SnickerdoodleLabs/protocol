import { IContextProvider } from "@query-engine/interfaces/utilities";
import { QueryEngineContext } from "@query-engine/interfaces/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ContextProvider implements IContextProvider {
    protected context: QueryEngineContext;

    public constructor() {
        this.context = new QueryEngineContext();
    }

    public getContext(): ResultAsync<QueryEngineContext, never> {
        return okAsync(this.context);
    }

    public setContext(context: QueryEngineContext): ResultAsync<void, never> {
        this.context = context;
        return okAsync(undefined);
    }
}