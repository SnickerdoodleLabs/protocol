import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { ApiName } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { PublicEvents, CoreContext } from "@core/interfaces/objects/index.js";
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
      false, // restoreInProgress
      new Subject<void>(), // heartbeat
      this.timeUtils.getUnixNow(), // startTime
      {}, // apiCalls
    );
  }

  public getContext(): ResultAsync<CoreContext, never> {
    return okAsync(this.context);
  }

  public setContext(context: CoreContext): ResultAsync<void, never> {
    this.context = context;
    return okAsync(undefined);
  }

  public incrementApi(apiName: ApiName): void {
    const existing = this.context.apiCalls[apiName];

    let newVal = 0;
    if (existing == null) {
      newVal = 1;
    } else {
      newVal = existing + 1;
    }
    this.context.apiCalls[apiName] = newVal;
  }
}
