import {
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
} from "@snickerdoodlelabs/objects";
import { ICoreListener } from "@interfaces/api";
import { ok, okAsync, ResultAsync } from "neverthrow";

export class CoreListener implements ICoreListener {
  constructor(protected core: ISnickerdoodleCore) {}

  public initialize(): ResultAsync<void, never> {
    this.core.getEvents().map((events: ISnickerdoodleCoreEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onQueryPosted.subscribe(this.onQueryPosted.bind(this));
      return ok(undefined);
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
