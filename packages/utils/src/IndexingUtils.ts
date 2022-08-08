import { join } from "path";

import { TypeParameter } from "@babel/types";
import { BigNumberString, PersistenceError } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BigNumber } from "sjcl";
import BTree, { DefaultComparable } from "sorted-btree";

import { IStorageUtils, IStorageUtilsType } from "@utils/IStorageUtils";

export enum EIndexType {
  ORDERED = 0,
  GROUPED = 1,
}

export class IndexKey {
  public constructor(
    public propertyName: string,
    public indexingType: EIndexType,
  ) {}
}

export class SuperKey<T> {
  public constructor(protected key: string[]) {}
  public getKey(obj: T): string {
    if (this.key.some((val, i, arr) => obj[val] == undefined)) {
      throw new PersistenceError("object is missing required properties");
    }
    return join(...this.key.map((k) => obj[k]));
  }
}

export class TableInfo<T> {
  public constructor(
    public name: string,
    public key: SuperKey<T>,
    public indexedBy: IndexKey[],
  ) {}
}

export interface ITableIndex<ObjectType> {
  getType(): EIndexType;
  add(...items: ObjectType[]): void;
  remove(...items: ObjectType[]): void;
  get(...items: DefaultComparable[]): Set<string>;
  getRange(
    low: DefaultComparable,
    high: DefaultComparable,
  ): [DefaultComparable, Set<string>][];
}

export class OrderedTableIndex<ObjectType> implements ITableIndex<ObjectType> {
  protected values: BTree<DefaultComparable, Set<string>>;

  public constructor(
    protected indexKey: IndexKey,
    protected superKey: SuperKey<ObjectType>,
    defaults?: ObjectType[],
  ) {
    this.values = new BTree();
    if (defaults != undefined) {
      this.add(...defaults);
    }
  }

  public getType(): EIndexType {
    return this.indexKey.indexingType;
  }

  public get(...items: DefaultComparable[]): Set<string> {
    const result = items.map((item) => {
      return this.values.get(item) || new Set<string>();
    });

    let ret = new Set<string>();
    result.forEach((val, _i, _arr) => {
      ret = new Set([...ret, ...val]);
    });
    return ret;
  }

  public getRange(
    low: DefaultComparable,
    high: DefaultComparable,
  ): [DefaultComparable, Set<string>][] {
    return this.values.getRange(low, high);
  }

  public add(...items: ObjectType[]): void {
    items.map((item) => {
      const recordName = this.superKey.getKey(item);
      const indexValue = this._getIndexValue(item);

      const existing =
        this.values.get(indexValue, new Set<string>()) || new Set();
      existing?.add(recordName);
      this.values.set(indexValue, existing);
    });
  }

  public remove(...items: ObjectType[]): void {
    items.map((item) => {
      const indexVal = this._getIndexValue(item);
      const existing = this.values.get(indexVal);
      if (existing != undefined) {
        existing.delete(this.superKey.getKey(item));
        this.values.set(indexVal, existing);
      }
    });
  }

  private _getIndexValue(obj: ObjectType): DefaultComparable {
    if (obj[this.indexKey.propertyName] == undefined) {
      throw new PersistenceError("index property not found in object");
    }
    return obj[this.indexKey.propertyName];
  }
}

export class GroupedTableIndex<ObjectType> implements ITableIndex<ObjectType> {
  protected values: BTree<DefaultComparable, Set<string>>;

  public constructor(
    protected indexKey: IndexKey,
    protected superKey: SuperKey<ObjectType>,
    defaults?: ObjectType[],
  ) {
    this.values = new BTree(undefined);
    if (defaults != undefined) {
      this.add(...defaults);
    }
  }

  public getType(): EIndexType {
    return this.indexKey.indexingType;
  }
  public add(...items: ObjectType[]): void {
    items.map((item) => {
      const recordName = this.superKey.getKey(item);
      const indexValue = this._getIndexValue(item);
      this.values.set(
        indexValue,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.values.get(indexValue, new Set())!.add(recordName),
        true,
      );
    });
  }

  public remove(...items: ObjectType[]): void {
    items.map((item) => {
      const recordName = this.superKey.getKey(item);
      const indexValue = this._getIndexValue(item);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lookup = this.values.get(indexValue, new Set())!;
      lookup.delete(recordName);
      this.values.set(indexValue, lookup);
    });
  }

  public get(...items: DefaultComparable[]): Set<string> {
    const lookups = items.map(
      (item) => this.values.get(item) ?? new Set<string>(),
    );
    let result = new Set<string>();
    result.forEach((val) => (result = new Set([...result, ...val])));
    return result;
  }

  public getRange(
    start: DefaultComparable,
    end: DefaultComparable,
  ): [DefaultComparable, Set<string>][] {
    throw new Error("Method not implemented.");
  }

  private _getIndexValue(obj: ObjectType): DefaultComparable {
    if (obj[this.indexKey.propertyName] == undefined) {
      throw new PersistenceError("index property not found in object");
    }
    return obj[this.indexKey.propertyName];
  }
}

export class IndexedTable<ObjectType> {
  private _initialized = false;
  protected indeces: Map<string, ITableIndex<ObjectType>>;

  public constructor(
    protected storage: IStorageUtils,
    protected schema: TableInfo<ObjectType>,
  ) {
    this.indeces = new Map();
  }

  public initialize(): ResultAsync<void, PersistenceError> {
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

  private _restoreIndex(
    indexKey: IndexKey,
  ): ResultAsync<ITableIndex<ObjectType>, PersistenceError> {
    const storageKey = this._getStorageKey(indexKey);
    if (indexKey.indexingType == EIndexType.GROUPED) {
      return this.storage
        .read<GroupedTableIndex<ObjectType>>(storageKey)
        .andThen((result) => {
          if (result == null) {
            return okAsync(
              new GroupedTableIndex<ObjectType>(indexKey, this.schema.key),
            );
          }
          return okAsync(result);
        });
    } else {
      return this.storage
        .read<OrderedTableIndex<ObjectType>>(storageKey)
        .andThen((result) => {
          if (result == null) {
            return okAsync(
              new OrderedTableIndex<ObjectType>(indexKey, this.schema.key),
            );
          } else {
            return okAsync(result);
          }
        });
    }
  }

  private _getStorageKey(indexKey: IndexKey): string {
    return join(this.schema.name, "INDEX", indexKey.propertyName);
  }

  public addRecord(record: ObjectType): ResultAsync<void, PersistenceError> {
    this.indeces.forEach((val, _key, _map) => {
      val.add(record);
    });

    const recordKey = this.getRecordKey(record);
    return this.storage.write(recordKey, record);
  }

  public getRecordKey(record: ObjectType): string {
    return join(this.schema.name, "RECORDS", this.schema.key.getKey(record));
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

  public get(
    indexKey: IndexKey,
    value: DefaultComparable,
  ): ResultAsync<ObjectType[], PersistenceError> {
    const index: ITableIndex<ObjectType> = this.indeces[indexKey.propertyName];
    const records = Array.from(index.get(value));
    return ResultUtils.combine(records.map((record) => this.getRecord(record)));
  }

  public getRange(
    indexKey: IndexKey,
    low: DefaultComparable,
    high: DefaultComparable,
  ): ResultAsync<Map<DefaultComparable, ObjectType[]>, PersistenceError> {
    if (indexKey.indexingType != EIndexType.ORDERED) {
      return errAsync(new PersistenceError("unsupporeted action"));
    }

    const index: ITableIndex<ObjectType> = this.indeces[indexKey.propertyName];
    const result = new Map<DefaultComparable, ObjectType[]>();

    // return ResultUtils.combine(index.getRange(low, high).map(([key, records]) => {
    //     result[key] = records;
    // }),).andThen((records) => return result);
  }
}
