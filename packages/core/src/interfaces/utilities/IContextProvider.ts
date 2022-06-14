import { ResultAsync } from "neverthrow";

import { QueryEngineContext } from "@core/interfaces/objects";

export interface IContextProvider {
  getContext(): ResultAsync<QueryEngineContext, never>;
  setContext(context: QueryEngineContext): ResultAsync<void, never>;
}

export const IContextProviderType = Symbol.for("IContextProvider");
