import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  PublicEvents,
  QueryEngineContext,
} from "@core/interfaces/objects";
import { IContextProvider } from "@core/interfaces/utilities";

@injectable()
export class ContextProvider implements IContextProvider {
  protected context: QueryEngineContext;

  public constructor() {
    this.context = new QueryEngineContext(
      null, // dataWalletAddress
      null, // sourceEntropy
      null, // dataWalletKey
      false, // loginInProgress
      new PublicEvents(), // publicEvents
    );
  }

  public getContext(): ResultAsync<QueryEngineContext, never> {
    return okAsync(this.context);
  }

  public setContext(context: QueryEngineContext): ResultAsync<void, never> {
    this.context = context;
    return okAsync(undefined);
  }
}
