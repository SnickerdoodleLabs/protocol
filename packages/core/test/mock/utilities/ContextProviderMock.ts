import {
  DataWalletAddress,
  LinkedAccount,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { dataWalletAddress, dataWalletKey } from "@core-tests/mock/mocks";
import { CoreContext, PublicEvents } from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

export class ContextProviderMock implements IContextProvider {
  public context: CoreContext;

  public publicEvents: PublicEvents;

  public onInitializedActivations: DataWalletAddress[] = [];
  public onQueryPostedActivations: SDQLQueryRequest[] = [];
  public onAccountAddedActivations: LinkedAccount[] = [];
  public onAccountRemovedActivations: LinkedAccount[] = [];

  constructor(context: CoreContext | null = null) {
    if (context != null) {
      this.context = context;
    } else {
      this.context = new CoreContext(
        dataWalletAddress,
        dataWalletKey,
        false,
        new PublicEvents(),
      );
    }

    this.publicEvents = this.context.publicEvents;

    this.publicEvents.onInitialized.subscribe((val) => {
      this.onInitializedActivations.push(val);
    });

    this.publicEvents.onQueryPosted.subscribe((val) => {
      this.onQueryPostedActivations.push(val);
    });

    this.publicEvents.onAccountAdded.subscribe((val) => {
      this.onAccountAddedActivations.push(val);
    });

    this.publicEvents.onAccountRemoved.subscribe((val) => {
      this.onAccountRemovedActivations.push(val);
    });
  }

  public getContext(): ResultAsync<CoreContext, never> {
    return okAsync({ ...this.context });
  }

  public setContextValues = new Array<CoreContext>();
  public setContext(context: CoreContext): ResultAsync<void, never> {
    this.setContextValues.push({ ...context });
    return okAsync<null, never>(null).map(() => {});
  }

  public assertEventCounts(expectedCounts: IExpectedEventCounts): void {
    const counts: IExpectedEventCounts = {
      onInitialized: 0,
      onQueryPosted: 0,
      onAccountAdded: 0,
      onAccountRemoved: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onInitializedActivations.length).toBe(counts.onInitialized);
    expect(this.onQueryPostedActivations.length).toBe(counts.onQueryPosted);
    expect(this.onAccountAddedActivations.length).toBe(counts.onAccountAdded);
    expect(this.onAccountRemovedActivations.length).toBe(
      counts.onAccountRemoved,
    );
  }
}

export interface IExpectedEventCounts {
  onInitialized?: number;
  onQueryPosted?: number;
  onAccountAdded?: number;
  onAccountRemoved?: number;
}
