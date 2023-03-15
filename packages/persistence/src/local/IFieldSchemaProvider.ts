import { ResultAsync } from "neverthrow";

import { FieldIndex } from "@persistence/local/FieldIndex.js";

export interface ILocalStorageSchemaProvider {
  getLocalStorageSchema(): ResultAsync<FieldIndex[], never>;
}

export const ILocalStorageSchemaProviderType = Symbol.for(
  "ILocalStorageSchemaProvider",
);
