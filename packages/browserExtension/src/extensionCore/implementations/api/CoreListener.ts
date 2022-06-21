import { IQueryEngine, IQueryEngineEvents } from "@snickerdoodlelabs/objects";

import { ICoreListener } from "@interfaces/api";
import { okAsync, ResultAsync } from "neverthrow";

export class CoreListener implements ICoreListener {
  constructor(protected core: IQueryEngine) {}

  public initialize(): ResultAsync<void, never> {
    this.core.getEvents().map((events: IQueryEngineEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onQueryPosted.subscribe(this.onInitialized.bind(this));
    });
    return okAsync(undefined);
  }
  private onInitialized(dataWalletAddress) {
    console.log("onInitialized", dataWalletAddress);
    return okAsync(undefined);
  }

  private onAccountAdded(account) {
    console.log("onAccountAdded", account);
    return okAsync(undefined);
  }

  private onQueryPosted(query) {
    console.log("onQueryPosted", query);
    return okAsync(undefined);
  }
}
