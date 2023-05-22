import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  PublicEvents,
  CoreContext,
  ComponentStatus,
  PrivateEvents,
} from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

@injectable()
export class ContextProvider implements IContextProvider {
  protected context: CoreContext;

  public constructor(@inject(ITimeUtilsType) protected timeUtils: ITimeUtils) {
    this.context = new CoreContext(
      null, // dataWalletAddress
      null, // dataWalletKey
      false, // unlockInProgress
      new PublicEvents(), // publicEvents,
      new PrivateEvents(), // privateEvents
      false, // restoreInProgress
      this.timeUtils.getUnixNow(), // startTime
      {}, // apiCalls
      new ComponentStatus(false, false, false, false, false, false, false),
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
