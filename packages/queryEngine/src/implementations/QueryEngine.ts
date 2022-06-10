/**
 * This is the main implementation of the Snickerdoodle Query Engine.
 * 
 * Regardless of form factor, you need to instantiate an instance of 
 */

import { IpfsCID, IQueryEngine, SDQLQuery } from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { queryEngineModule } from "@query-engine/implementations/QueryEngineModule";
import { Observable, Subject } from "rxjs";
import { IQueryService, IQueryServiceType } from "@query-engine/interfaces/business";

export class QueryEngine implements IQueryEngine {
    protected iocContainer: Container;

    public constructor() {
        this.iocContainer = new Container();

        // Elaborate syntax to demonstrate that we can use multiple modules
        this.iocContainer.load(...[queryEngineModule]);

        // Initialize your events. I use RXJS Subjects here for reasons,
        // mainly in that RXJS is a fantastic library and you can do a 
        // ton of things once you have things defined as event streams.
        // We'll make a "Context" object that actually contains the events,
        // and is behind a ContextProvider.
        this.onQueryPosted = new Subject();
    }

    public initialize(): ResultAsync<void, never> {
        // This is the place to do all of your asynchronous initialization stuff.
        // You can't do that in the constructor.

        return okAsync(undefined);
    }

    public addData(): ResultAsync<void, never> {
        return okAsync(undefined);
    }

    public processQuery(queryId: IpfsCID): ResultAsync<void, Error> {
        const queryService = this.iocContainer.get<IQueryService>(IQueryServiceType);

        return queryService.processQuery(queryId);
    }

    public onQueryPosted: Observable<SDQLQuery>;
}
