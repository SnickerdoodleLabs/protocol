import {
  ERecordKey,
  PersistenceError,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { ObjectClass } from "realm";

import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex";

export interface IVolatileStorageSchemaProvider {
  getVolatileStorageSchema(): ResultAsync<
    Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
    never
  >;

  getMigratorForTable<T extends VersionedObject>(
    tableName: ERecordKey,
  ): ResultAsync<VersionedObjectMigrator<T>, PersistenceError>;
  getRealmClassForTable(
    tableName: ERecordKey,
  ): ResultAsync<ObjectClass<any>, PersistenceError>;
}

export const IVolatileStorageSchemaProviderType = Symbol.for(
  "IVolatileStorageSchemaProvider",
);
