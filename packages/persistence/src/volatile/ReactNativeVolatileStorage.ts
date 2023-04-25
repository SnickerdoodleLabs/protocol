/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EBoolean,
  ERecordKey,
  JSONString,
  PersistenceError,
  VersionedObject,
  VolatileStorageDataKey,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IAsyncStorageWrapper,
  IAsyncStorageWrapperType,
} from "@persistence/volatile/IAsyncStorageWrapper.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";
import { IVolatileStorage } from "@persistence/volatile/IVolatileStorage.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

@injectable()
export class ReactNativeVolatileStorage implements IVolatileStorage {
  private _keyPaths: Map<ERecordKey, string | string[]> | undefined;
  protected keysBySchema = new Map<ERecordKey, Set<string>>();

  public constructor(
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
    @inject(IAsyncStorageWrapperType)
    protected asyncStorage: IAsyncStorageWrapper,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAllByIndex<T extends VersionedObject>(
    schemaKey: ERecordKey,
    index: VolatileStorageKey,
    query: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  // Taken directly from IndexDB.js
  public getKey(
    schemaKey: ERecordKey,
    obj: VersionedObject,
  ): ResultAsync<VolatileStorageKey | null, PersistenceError> {
    return this.initialize().andThen(() => {
      const keyPath = this._keyPaths!.get(schemaKey);
      if (keyPath == undefined) {
        return errAsync(new PersistenceError("invalid table name"));
      }

      if (keyPath == VolatileTableIndex.DEFAULT_KEY) {
        return okAsync(null);
      }

      try {
        if (Array.isArray(keyPath)) {
          const ret: VolatileStorageKey = [];
          keyPath.forEach((item) => {
            ret.push(this._getRecursiveKey(obj, item));
          });
          return okAsync(ret);
        } else {
          return okAsync(this._getRecursiveKey(obj, keyPath));
        }
      } catch (e) {
        return errAsync(
          new PersistenceError("error extracting key from object", e),
        );
      }
    });
  }

  public persist(): ResultAsync<boolean, PersistenceError> {
    return okAsync(true);
  }

  public clearObjectStore(name: string): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public putObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    obj: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return this.initialize()
      .andThen(() => {
        return this.getKey(schemaKey, obj.data);
      })
      .andThen((volatileStorageKey) => {
        // If the volatileStorageKey is null, that means we need to generate a key
        if (volatileStorageKey == null) {
          volatileStorageKey = 1; // TODO
        }

        // Check if we actually have this object already
        return this.getObjectStorageKey(schemaKey, volatileStorageKey).andThen(
          (objectStorageKey) => {
            // Add the key to our list of known keys
            let existingKeys = this.keysBySchema.get(schemaKey);
            if (existingKeys == null) {
              existingKeys = new Set();
              this.keysBySchema.set(schemaKey, existingKeys);
            }
            existingKeys!.add(objectStorageKey);

            // This will overwrite an existing object
            obj.lastUpdate = this.timeUtils.getUnixNow();
            obj.deleted = EBoolean.FALSE;
            return this.asyncStorage
              .setItem(objectStorageKey, ObjectUtils.serialize(obj))
              .andThen(() => {
                return this.asyncStorage.setItem(
                  this.getSchemaIndexKey(schemaKey),
                  ObjectUtils.serialize(existingKeys),
                );
              });
          },
        );
      });
  }

  public removeObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return this.getObjectStorageKey(schemaKey, key).andThen(
      (objectStorageKey) => {
        return this.asyncStorage
          .getItem(objectStorageKey)
          .andThen((objectStr) => {
            // We'll return the object at the end if it exists.

            // First, we'll remove the object from the list in memory, then on disk, then nuke
            // the actual entry.
            const knownKeys = this.keysBySchema.get(schemaKey)!;
            knownKeys.delete(objectStorageKey);

            // Now remove from the list on disk
            return this.asyncStorage
              .setItem(
                this.getSchemaIndexKey(schemaKey),
                ObjectUtils.serialize(knownKeys),
              )
              .andThen(() => {
                // Now from disk
                return this.asyncStorage.removeItem(objectStorageKey);
              })
              .map(() => {
                // If there's an existing object, deserialize and return it, otherwise null
                if (objectStr == null) {
                  return null;
                }
                return ObjectUtils.deserialize<VolatileStorageMetadata<T>>(
                  JSONString(objectStr),
                );
              });
          });
      },
    );
  }

  public getObject<T extends VersionedObject>(
    schemaKey: ERecordKey,
    key: VolatileStorageKey,
    _includeDeleted?: boolean,
  ): ResultAsync<VolatileStorageMetadata<T> | null, PersistenceError> {
    return ResultUtils.combine([
      this.getObjectStorageKey(schemaKey, key),
      this.initialize(),
    ]).andThen(([objectStorageKey]) => {
      // Make sure the object exists
      const existingKeySet = this.keysBySchema.get(schemaKey)!;
      if (!existingKeySet.has(objectStorageKey)) {
        // Not a known key!
        return okAsync(null);
      }

      // Known key, get the object
      return this.asyncStorage
        .getItem(objectStorageKey)
        .andThen((objectStr) => {
          if (objectStr == null) {
            return errAsync(
              new PersistenceError(
                `Object key ${objectStorageKey} is in the set of known keys but is not available from storage!`,
              ),
            );
          }
          return okAsync(
            ObjectUtils.deserialize<VolatileStorageMetadata<T>>(
              JSONString(objectStr),
            ),
          );
        });
    });
  }

  public getCursor<T extends VersionedObject>(
    schemaKey: ERecordKey,
    indexName?: string,
    query?: string | number,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    //@ts-ignore
    return okAsync(null);
  }

  public getAll<T extends VersionedObject>(
    schemaKey: ERecordKey,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.initialize().andThen(() => {
      const knownKeysBySchemaSet = this.keysBySchema.get(schemaKey)!;

      return this.asyncStorage
        .getItems(Array.from(knownKeysBySchemaSet.values()))
        .map((valueMap) => {
          // Loop over the values of the returned items
          const values = Array.from(valueMap.values());

          return values
            .filter((value) => {
              return value != null;
            })
            .map((objectStr) => {
              return ObjectUtils.deserialize<VolatileStorageMetadata<T>>(
                JSONString(objectStr!),
              );
            });
        });
    });
  }

  public getAllKeys<T>(
    schemaKey: ERecordKey,
    index?: VolatileStorageKey,
    query?: IDBValidKey | IDBKeyRange,
    count?: number | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.asyncStorage.getItem(schemaKey).andThen((result) => {
      if (result) {
        return okAsync(JSON.parse(result) as T[]) ?? {};
      } else {
        return okAsync([] as unknown as T[]);
      }
    });
  }

  private _getRecursiveKey(obj: object, path: string): string | number {
    const items = path.split(".");
    let ret = obj;
    items.forEach((x) => {
      ret = ret[x];
    });

    return ret as unknown as string | number;
  }

  private _getCompoundIndexName(key: (string | number)[]): string {
    return key.join(",");
  }

  private _getFieldPath(name: VolatileStorageKey): string {
    return [VolatileStorageDataKey, name.toString()].join(".");
  }

  private _getIndexName(index: VolatileStorageKey): string {
    if (Array.isArray(index)) {
      const paths = index.map((x) => this._getFieldPath(x));
      return this._getCompoundIndexName(paths);
    }
    return this._getFieldPath(index);
  }

  private initialize(): ResultAsync<void, PersistenceError> {
    if (this._keyPaths != null) {
      return okAsync(undefined);
    }

    return this.schemaProvider
      .getVolatileStorageSchema()
      .andThen((schemaMap) => {
        const keyPaths = new Map<ERecordKey, string | string[]>();

        // Convert the map to an array
        const schemaArr = Array.from(schemaMap.values());

        return ResultUtils.combine(
          schemaArr.map((schema) => {
            // Cache the key paths
            keyPaths.set(schema.name, schema.keyPath);

            // For each table schema, we need to read the contents of the index and populate keysBySchema
            return this.asyncStorage
              .getItem(this.getSchemaIndexKey(schema.name))
              .map((schemaIndexStr) => {
                if (schemaIndexStr == null) {
                  schemaIndexStr = "[]";
                }

                // Populate keysBySchema
                const knownKeysForSchema = ObjectUtils.deserialize<string[]>(
                  JSONString(schemaIndexStr),
                );
                this.keysBySchema.set(schema.name, new Set(knownKeysForSchema));
              });
          }),
        ).map(() => {
          // Don't assign to _keyPaths until it's populated to avoid any possible race condition
          this._keyPaths = keyPaths;
        });
      });
  }

  protected getObjectStorageKey(
    schemaKey: ERecordKey,
    volatileKey: VolatileStorageKey,
  ): ResultAsync<string, never> {
    const serializedKey = ObjectUtils.serialize(volatileKey);
    return this.cryptoUtils.hashStringSHA256(serializedKey).map((hash) => {
      return `SD_Wallet.${schemaKey}.${hash}`;
    });
  }

  protected getSchemaIndexKey(schemaKey: ERecordKey): string {
    return `SD_Wallet.${schemaKey}.index`;
  }
}
