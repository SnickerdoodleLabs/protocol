import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { IIndexerContextProvider } from "@snickerdoodlelabs/indexers";
import {
  ComponentStatus,
  EChain,
  EComponentStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  PublicEvents,
  CoreContext,
  PrivateEvents,
} from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

@injectable()
export class ContextProvider
  implements IContextProvider, IIndexerContextProvider
{
  protected context: CoreContext;

  public constructor(@inject(ITimeUtilsType) protected timeUtils: ITimeUtils) {
    this.context = new CoreContext(
      null, // dataWalletAddress
      null, // dataWalletKey
      false, // unlockInProgress
      new PublicEvents(), // publicEvents,
      new PrivateEvents(), // privateEvents
      false, // restoreInProgress
      new Subject<void>(), // heartbeat
      this.timeUtils.getUnixNow(), // startTime
      new ComponentStatus(
        EComponentStatus.TemporarilyDisabled,
        EComponentStatus.TemporarilyDisabled,
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        [],
      ),
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
