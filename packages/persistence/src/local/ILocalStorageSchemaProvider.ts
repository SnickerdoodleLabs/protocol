import { ResultAsync } from "neverthrow";

import { LocalStorageIndex } from "@persistence/local/LocalStorageIndex.js";

export interface ILocalStorageSchemaProvider {
  getLocalStorageSchema(): ResultAsync<LocalStorageIndex[], never>;
}

export const ILocalStorageSchemaProviderType = Symbol.for(
  "ILocalStorageSchemaProvider",
);
