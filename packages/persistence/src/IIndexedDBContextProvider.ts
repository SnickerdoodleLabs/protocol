import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IIndexedDBContext } from "@persistence/IIndexedDBContext.js";

export interface IIndexedDBContextProvider {
  setContext(context: IIndexedDBContext): ResultAsync<void, PersistenceError>;
  getContext(): ResultAsync<IIndexedDBContext, PersistenceError>;
}

export const IIndexedDBContextProviderType = Symbol.for(
  "IndexedDBContextProvider",
);
