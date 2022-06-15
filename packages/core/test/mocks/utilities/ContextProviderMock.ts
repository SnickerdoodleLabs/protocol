import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { QueryEngineContext } from "@core/interfaces/objects";
import { IContextProvider } from "@core/interfaces/utilities";

export class ContextProviderMock implements IContextProvider {
  public context: QueryEngineContext;

  public onControlClaimed: Subject<number>;
  public onControlClaimedActivations: number[] = [];

  constructor(context: QueryEngineContext | null = null) {
    this.onControlClaimed = new Subject();
    this.onControlClaimed.subscribe((val) => {
      this.onControlClaimedActivations.push(val);
    });

    if (context != null) {
      this.context = context;
    } else {
      //this.context = new QueryEngineContext();
    }
  }

  public getContext(): ResultAsync<QueryEngineContext, never> {
    return okAsync(this.context);
  }

  public setContextValues = new Array<QueryEngineContext>();
  public setContext(context: QueryEngineContext): ResultAsync<void, never> {
    this.setContextValues.push(context);
    return okAsync<null, never>(null).map(() => { });
  }

  public assertEventCounts(expectedCounts: IExpectedEventCounts): void {
    const counts: IExpectedEventCounts = {
      onControlClaimed: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onControlClaimedActivations.length).toBe(
      counts.onControlClaimed,
    );

    // Add a new claim for each event
    expect(this.onControlClaimedActivations.length).toBe(
      counts.onControlClaimed,
    );
  }
}

export interface IExpectedEventCounts {
  onControlClaimed?: number;
}
