import {
  IQueryEngine,
  IQueryEngineEvents,
} from "@snickerdoodlelabs/objects";

import { ICoreListener } from "@interfaces/api";
import { okAsync, ResultAsync } from "neverthrow";

export class CoreListener implements ICoreListener {
  constructor(protected core: IQueryEngine) {}
  public initialize(): ResultAsync<void, never> {
    this.core.getEvents().map((events: IQueryEngineEvents) => {
      events.onInitialized.subscribe(this.onInitialized);
      events.onAccountAdded.subscribe(this.onAccountAdded);
      events.onQueryPosted.subscribe(this.onInitialized);
    });
    return okAsync(undefined);
  }
  public onInitialized(dataWalletAddress) {
    console.log("onInitialized", dataWalletAddress);
    return okAsync(undefined);
  }

  public onAccountAdded(account) {
    console.log("onAccountAdded", account);
    return okAsync(undefined);
  }

  public onQueryPosted(query) {
    console.log("onQueryPosted", query);
    return okAsync(undefined);
  }
}
