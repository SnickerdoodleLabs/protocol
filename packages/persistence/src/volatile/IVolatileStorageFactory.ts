import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  VolatileTableConfig,
  IVolatileStorageTable,
} from "@persistence/volatile/IVolatileStorageTable.js";

export interface IVolatileStorageFactory {
  getStore(
    config: VolatileTableConfig,
  ): ResultAsync<IVolatileStorageTable, PersistenceError>;
}
export const IVolatileStorageFactoryType = Symbol.for(
  "IVolatileStorageFactory",
);
