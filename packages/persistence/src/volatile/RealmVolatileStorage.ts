import { createRealmContext, RealmContext } from "@realm/react";
import {
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
  VolatileStorageKey,
  ERecordKey,
  VolatileStorageMetadataWrapper,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import Realm, { ObjectClass } from "realm";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";
import { RealmCursor } from "@persistence/volatile/RealmCursor.js";
import { VolatileStorageQuery } from "@persistence/volatile/VolatileStorageQuery.js";

@injectable()
export class RealmVolatileStorage implements IVolatileStorage {
  private _init?: ResultAsync<RealmContext, PersistenceError>;

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {}

  public persist(): ResultAsync<boolean, PersistenceError> {
    return okAsync(true); // handled in constructor
  }

  public clearObjectStore(
    recordKey: ERecordKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.schemaProvider.getRealmClassForTable(recordKey),
      this.init(),
    ]).andThen(([realmClass, context]) => {
      const { RealmProvider, useRealm, useObject, useQuery } = context;
      const realm = useRealm();
      const query = useQuery(realmClass);
      try {
        realm.write(() => {
          realm.delete(query);
        });
        return okAsync(undefined);
      } catch (err) {
        return errAsync(
          new PersistenceError("error clearing object store", err),
        );
      }
    });
  }

  public putObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    obj: T,
  ): ResultAsync<void, PersistenceError> {
    return this.init().andThen((context) => {
      const { RealmProvider, useRealm, useObject, useQuery } = context;
      const realm = useRealm();
      try {
        realm.write(() => {
          realm.create(recordKey, obj as Unmanaged<unknown, never>, "modified");
        });
        return okAsync(undefined);
      } catch (err) {
        return errAsync(new PersistenceError("error putting object", err));
      }
    });
  }

  public removeObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<undefined, PersistenceError> {
    return this.init().andThen((context) => {
      const { RealmProvider, useRealm, useObject, useQuery } = context;
      const realm = useRealm();
      try {
        realm.write(() => {
          realm.delete(realm.objectForPrimaryKey(recordKey, key));
        });
        return okAsync(undefined);
      } catch (err) {
        return errAsync(new PersistenceError("error putting object", err));
      }
    });
  }

  public getObject<T extends VersionedObject>(
    recordKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return ResultUtils.combine([
      this.schemaProvider.getRealmClassForTable(recordKey),
      this.init(),
    ]).andThen(([realmClass, context]) => {
      const { RealmProvider, useRealm, useObject, useQuery } = context;
      const realm = useRealm();
      const query = useObject(realmClass, key);
      if (query == null) {
        return okAsync(null);
      }
      return this.schemaProvider
        .getMigratorForTable<T>(recordKey)
        .map((migrator) => {
          return migrator.getCurrent(
            query as unknown as Record<string, unknown>,
            migrator.getCurrentVersion(),
          );
        });
    });
  }

  public getCursor<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.getAll<T>(recordKey, query).map((results) => {
      return new RealmCursor<T>(results);
    });
  }

  public getAll<T extends VersionedObject>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    return ResultUtils.combine([
      this.schemaProvider.getRealmClassForTable(recordKey),
      this.init(),
    ]).andThen(([realmClass, context]) => {
      const { RealmProvider, useRealm, useObject, useQuery } = context;
      const realm = useRealm();
      const results =
        query == undefined
          ? useQuery(realmClass)
          : useQuery(realmClass).filtered(query.realmQuery);
      return this.schemaProvider
        .getMigratorForTable<T>(recordKey)
        .map((migrator) => {
          return (results as unknown as Record<string, unknown>[]).map(
            (val) => {
              return migrator.getCurrent(val, migrator.getCurrentVersion());
            },
          );
        });
    });
  }

  public getAllKeys<T>(
    recordKey: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError> {
    // no get keys functionality for realm
    return this.getAll(recordKey, query).map((results) => {
      return results.map((x) => x.pKey as T);
    });
  }

  private init(): ResultAsync<RealmContext, PersistenceError> {
    if (this._init != undefined) {
      return this._init;
    }

    return this.schemaProvider.getVolatileStorageSchema().andThen((schema) => {
      const objects = Array.from(schema.values()).map((x) => x.realmClass);
      const config: Realm.Configuration = {
        schema: objects,
      };
      this._init = okAsync(createRealmContext(config));
      return this._init;
    });
  }
}
