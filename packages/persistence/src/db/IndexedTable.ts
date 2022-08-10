import { join } from "path";

import {
  IFilter,
  PersistenceError,
  SerializationError,
} from "@snickerdoodlelabs/objects";
import { ISerializer } from "@utils/ISerializer";
import { IStorageUtils } from "@utils/IStorageUtils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { IMap } from "sorted-btree";

import {
  OrderedTableIndex,
  TableInfo,
  IndexKey,
  EIndexType,
} from "@persistence/db";

export class IndexedTable<ObjectType> {
  private _initialized = false;
  protected indeces: Map<string, OrderedTableIndex<ObjectType>>;

  public constructor(
    protected storage: IStorageUtils,
    protected schema: TableInfo<ObjectType>,
    protected serializer: ISerializer,
  ) {
    this.indeces = new Map();
  }

  private restore(): ResultAsync<void, PersistenceError | SerializationError> {
    return ResultUtils.combine(
      this.schema.indexedBy.map((indexKey) =>
        this._restoreIndex(indexKey).andThen((tableIndex) => {
          this.indeces[indexKey.propertyName] = tableIndex;
          return okAsync(tableIndex);
        }),
      ),
    ).andThen((_resultArr) => {
      this._initialized = true;
      return okAsync(undefined);
    });
  }

  public initialize(): ResultAsync<
    void,
    PersistenceError | SerializationError
  > {
    if (this._initialized) {
      return okAsync(undefined);
    }
    return this.restore();
  }

  private _restoreIndex(
    indexKey: IndexKey,
  ): ResultAsync<
    OrderedTableIndex<ObjectType>,
    PersistenceError | SerializationError
  > {
    const storageKey = this._getStorageKey(indexKey);
    return this.storage.read<string>(storageKey).andThen((raw) => {
      if (raw == null) {
        return okAsync(
          new OrderedTableIndex<ObjectType>(
            indexKey,
            this.schema.key,
            indexKey.comparator,
          ),
        );
      }

      return this.serializer.deserialize<OrderedTableIndex<ObjectType>>(raw);
    });
  }

  private _getStorageKey(indexKey: IndexKey): string {
    return join(this.schema.name, "INDEX", indexKey.propertyName);
  }

  public addRecords(
    records: ObjectType[],
  ): ResultAsync<void, PersistenceError | SerializationError> {
    return this.initialize().andThen(() => {
      return ResultUtils.combine(
        records.map((record) => {
          this.indeces.forEach((val, _key, _map) => {
            val.add(record);
          });

          const recordKey = this.getRecordKey(record);
          return this.storage.write(recordKey, record);
        }),
      ).andThen(() => {
        return this._persistIndexes();
      });
    });
  }

  public removeRecord(
    record: ObjectType,
  ): ResultAsync<void, PersistenceError | SerializationError> {
    return this.initialize().andThen(() => {
      this.indeces.forEach((val, _key, _map) => {
        val.remove(record);
      });

      return this.storage.remove(this.getRecordKey(record)).andThen(() => {
        return this._persistIndexes();
      });
    });
  }

  private _persistIndexes(): ResultAsync<
    void,
    PersistenceError | SerializationError
  > {
    return ResultUtils.combine(
      Array.from(this.indeces).map(([indexName, indexObj]) => {
        return this._write<OrderedTableIndex<ObjectType>>(
          this.getIndexKey(indexName),
          indexObj,
        );
      }),
    ).andThen(() => okAsync(undefined));
  }

  private _write<T>(
    key: string,
    obj: T,
  ): ResultAsync<void, PersistenceError | SerializationError> {
    return ResultUtils.combine([
      this.serializer.serialize(obj),
      this.storage.getMaxDocumentSize(),
    ]).andThen(([doc, maxSize]) => {
      if (doc.length > maxSize) {
        // TODO: page logic
        return errAsync(new PersistenceError("max document size exceeded"));
      }

      return this.storage.write(key, doc);
    });
  }

  public getRecordKey(record: ObjectType): string {
    return join(this.schema.name, "RECORDS", this.schema.key.getKey(record));
  }

  public getIndexKey(index: string): string {
    return join(this.schema.name, "INDEX", index);
  }

  public getRecord(key: string): ResultAsync<ObjectType, PersistenceError> {
    const recordKey = join(this.schema.name, "RECORDS", key);
    return this.storage.read<ObjectType>(recordKey).map((result) => {
      if (result == null) {
        throw new PersistenceError("record not found");
      }
      return result;
    });
  }

  public get<KeyType = any>(
    indexProperty: string,
    value: KeyType,
  ): ResultAsync<Set<string>, PersistenceError | SerializationError> {
    return this.initialize().andThen(() => {
      const index: OrderedTableIndex<ObjectType> = this.indeces[indexProperty];
      return okAsync(index.get(value));
    });
  }

  public getRange<KeyType = any>(
    indexProperty: string,
    low: KeyType,
    high: KeyType,
  ): ResultAsync<Set<string>, PersistenceError | SerializationError> {
    return this.initialize().andThen(() => {
      const index = this.indeces.get(indexProperty);
      if (index == undefined) {
        return errAsync(
          new PersistenceError(
            `indexing property not found in object ${indexProperty}`,
          ),
        );
      }

      const indexResult = index.getRange(low, high);

      const result = new Set<string>();
      indexResult.forEach(([_key, records]) => {
        records.forEach((str) => {
          result.add(str);
        });
      });
      return okAsync(result);
    });
  }

  public getFirstMatch(
    indexProperty: string,
    matching: IFilter<ObjectType>,
    reversed?: boolean,
  ): ResultAsync<ObjectType | null, PersistenceError | SerializationError> {
    const index = this.indeces.get(indexProperty);
    if (index == undefined) {
      return errAsync(
        new PersistenceError(
          `indexing property not found in object ${indexProperty}`,
        ),
      );
    }

    const iterator = index.getIterator(reversed);
    if (iterator == undefined) {
      return okAsync(null);
    }

    return this._findMatch(iterator, matching);
  }

  private _findMatch(
    iterator: IterableIterator<[any, Set<string>]>,
    matching?: IFilter<ObjectType>,
  ): ResultAsync<ObjectType | null, PersistenceError | SerializationError> {
    const curr = iterator.next();
    if (curr.done) {
      return okAsync(null);
    }

    const [_indexVal, recordKeys] = curr.value;
    return this._checkRecords(recordKeys.entries()).andThen((obj) => {
      if (obj == null) {
        return this._findMatch(iterator, matching);
      }
      return okAsync(obj);
    });
  }

  private _checkRecords(
    keys: IterableIterator<[string, string]>,
    matching?: IFilter<ObjectType>,
  ): ResultAsync<ObjectType | null, PersistenceError | SerializationError> {
    const curr = keys.next();
    if (curr.done) {
      return okAsync(null);
    }

    const [key, _] = curr.value;
    return this.getRecord(key).andThen((record) => {
      if (matching == undefined || matching.matches(record)) {
        return okAsync(record);
      }
      return this._checkRecords(keys, matching);
    });
  }

  public getHistogram(
    indexProperty: string,
  ): ResultAsync<IMap<any, number>, PersistenceError | SerializationError> {
    const index = this.indeces.get(indexProperty);
    if (index == undefined) {
      return errAsync(
        new PersistenceError(
          `indexing property not found in object ${indexProperty}`,
        ),
      );
    }

    return okAsync(index.getHistogram());
  }
}
