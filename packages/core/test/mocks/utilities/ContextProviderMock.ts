import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { CoreContext } from "@core/interfaces/objects";
import { IContextProvider } from "@core/interfaces/utilities";

export class ContextProviderMock implements IContextProvider {
  public context: CoreContext;

  public onControlClaimed: Subject<number>;
  public onControlClaimedActivations: number[] = [];

  constructor(context: CoreContext | null = null) {
    this.onControlClaimed = new Subject();
    this.onControlClaimed.subscribe((val) => {
      this.onControlClaimedActivations.push(val);
    });

    if (context != null) {
      this.context = context;
    } else {
      //this.context = new CoreContext();
    }
  }

  public getContext(): ResultAsync<CoreContext, never> {
    return okAsync(this.context);
  }

  public setContextValues = new Array<CoreContext>();
  public setContext(context: CoreContext): ResultAsync<void, never> {
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
