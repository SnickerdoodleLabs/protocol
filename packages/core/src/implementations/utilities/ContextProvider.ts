import { IIndexerContextProvider } from "@snickerdoodlelabs/indexers";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { PublicEvents, CoreContext } from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";
import { ComponentStatus, EChain, EComponentStatus } from "@snickerdoodlelabs/objects";

@injectable()
export class ContextProvider
  implements IContextProvider, IIndexerContextProvider
{
  protected context: CoreContext;

  public constructor() {
    this.context = new CoreContext(
      null, // dataWalletAddress
      null, // dataWalletKey
      false, // unlockInProgress
      new PublicEvents(), // publicEvents,
      false,
      /* 


        The Component Status tracks the status of multiple indexer services offered within the Snickerdoodle Core. 
        These indexer services rely on api keys passed in from the config file asking for config keys.  
      */
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
