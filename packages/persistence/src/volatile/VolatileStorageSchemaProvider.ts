import {
  ERecordKey,
  VersionedObject,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { getObjectStoreDefinitions } from "@persistence/database/objectStores.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { IVolatileStorageSchemaProvider } from "@persistence/volatile/IVolatileStorageSchemaProvider.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

@injectable()
export class VolatileStorageSchemaProvider
  implements IVolatileStorageSchemaProvider
{
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getCurrentVersionForTable(
    tableName: ERecordKey,
  ): ResultAsync<number, PersistenceError> {
    return this.getVolatileStorageSchema().andThen((schema) => {
      const volatileTableIndex = schema.get(tableName);
      if (volatileTableIndex == null) {
        return errAsync(
          new PersistenceError("no schema present for table", tableName),
        );
      }
      return okAsync(volatileTableIndex.migrator.getCurrentVersion());
    });
  }

  public getVolatileStorageSchema(): ResultAsync<
    Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
    never
  > {
    return this.configProvider
      .getConfig()
      .map((config) => getObjectStoreDefinitions(config));
  }
}
