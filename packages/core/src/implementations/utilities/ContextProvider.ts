import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { PublicEvents, CoreContext } from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

@injectable()
export class ContextProvider implements IContextProvider {
  protected context: CoreContext;

  public constructor() {
    this.context = new CoreContext(
      null, // dataWalletAddress
      null, // dataWalletKey
      false, // unlockInProgress
      new PublicEvents(), // publicEvents
    );
  }

  public getContext(): ResultAsync<CoreContext, never> {
    return okAsync(this.context);
  }

  public setContext(context: CoreContext): ResultAsync<void, never> {
    this.context = context;
    return okAsync(undefined);
  }
}
