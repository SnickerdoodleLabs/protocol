import { IContextProvider } from "@query-engine/interfaces/utilities";
import { QueryEngineContext } from "@query-engine/interfaces/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";
import { EthereumAccountAddress, SDQLQuery } from "@snickerdoodlelabs/objects";


@injectable()
export class ContextProvider implements IContextProvider {
    protected context: QueryEngineContext;
    //protected sdqlqueries: SDQLQuery;
    //protected queries: 

    public constructor() {
        //Subject<SDQLQuery> sampled = new Subject<SDQLQuery>();
        this.context = new QueryEngineContext(null, new Subject<SDQLQuery>());
    }

    public getContext(): ResultAsync<QueryEngineContext, never> {
        return okAsync(this.context);
    }

    public setContext(context: QueryEngineContext): ResultAsync<void, never> {
        this.context = context;
        return okAsync(undefined);
    }
}