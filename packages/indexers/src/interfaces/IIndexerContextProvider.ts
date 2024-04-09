import { ResultAsync } from "neverthrow";

import { IIndexerContext } from "@indexers/interfaces/IIndexerContext.js";

export interface IIndexerContextProvider {
  getContext(): ResultAsync<IIndexerContext, never>;
  setContext(context: IIndexerContext): ResultAsync<void, never>;
}

export const IIndexerContextProviderType = Symbol.for(
  "IIndexerContextProvider",
);
