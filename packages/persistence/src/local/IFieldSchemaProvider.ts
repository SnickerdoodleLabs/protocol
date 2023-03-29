import { EFieldKey } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { FieldIndex } from "@persistence/local/FieldIndex.js";

export interface IFieldSchemaProvider {
  getLocalStorageSchema(): ResultAsync<Map<EFieldKey, FieldIndex>, never>;
}

export const IFieldSchemaProviderType = Symbol.for("IFieldSchemaProvider");
