import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { IIndexerContextProvider } from "@snickerdoodlelabs/indexers";
import {
  ComponentStatus,
  EChain,
  EComponentStatus,
  PublicEvents,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreContext, PrivateEvents } from "@core/interfaces/objects/index.js";
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
      false, // initializeInProgress
      new PublicEvents(), // publicEvents,
      new PrivateEvents(), // privateEvents
      false, // restoreInProgress
      this.timeUtils.getUnixNow(), // startTime
      new ComponentStatus(
        EComponentStatus.NoKeyProvided,
        EComponentStatus.NoKeyProvided,
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
        new Map<EChain, EComponentStatus>(),
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
