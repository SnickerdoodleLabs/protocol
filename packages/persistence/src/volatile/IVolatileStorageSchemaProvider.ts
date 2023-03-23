import { ERecordKey, VersionedObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex";

export interface IVolatileStorageSchemaProvider {
  getVolatileStorageSchema(): ResultAsync<
    Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
    never
  >;
}

export const IVolatileStorageSchemaProviderType = Symbol.for(
  "IVolatileStorageSchemaProvider",
);
