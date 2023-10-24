import { ResultAsync } from "neverthrow";

import { IPersistenceContext } from "@persistence/IPersistenceContext.js";

export interface IPersistenceContextProvider {
  getContext(): ResultAsync<IPersistenceContext, never>;
  setContext(context: IPersistenceContext): ResultAsync<void, never>;
}

export const IPersistenceContextProviderType = Symbol.for(
  "IPersistenceContextProvider",
);
