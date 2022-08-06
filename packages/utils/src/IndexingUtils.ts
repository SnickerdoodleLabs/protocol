import { join } from "path";

import { TypeParameter } from "@babel/types";
import { BigNumberString, PersistenceError } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { BigNumber } from "sjcl";
import BTree, { DefaultComparable } from "sorted-btree";

import { IStorageUtils, IStorageUtilsType } from "@utils/IStorageUtils";

export enum EIndexType {
  ORDERED = 0,
  GROUPED = 1,
}

export class IndexKey<PropertyType> {
  public constructor(
    public propertyName: string,
    public indexingType: EIndexType,
    public comparator?: (a: PropertyType, b: PropertyType) => number,
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
    public indexedBy: Map<string, IndexKey<DefaultComparable>[]>,
  ) {}
}

export interface ITableIndex<ObjectType, PropertyType> {
  getType(): EIndexType;
  add(...items: ObjectType[]): void;
  remove(...items: ObjectType[]): void;
  get(...items: ObjectType[]): Set<string>;
  getRange(low: ObjectType, high: ObjectType): [PropertyType, string][];
}

export class OrderedTableIndex<ObjectType, PropertyType>
  implements ITableIndex<ObjectType, PropertyType>
{
  protected values: BTree<PropertyType, string>;

  public constructor(
    protected indexKey: IndexKey<PropertyType>,
    protected superKey: SuperKey<ObjectType>,
    defaults?: ObjectType[],
  ) {
    this.values = new BTree(undefined, indexKey.comparator);
    if (defaults != undefined) {
      this.add(...defaults);
    }
  }

  public getType(): EIndexType {
    return this.indexKey.indexingType;
  }

  public get(...items: ObjectType[]): Set<string> {
    const result: string[] = items
      .map((item) => {
        return this.values.get(this._getIndexValue(item)) ?? "";
      })
      .filter((x) => {
        x != "";
      });
    return new Set(result);
  }

  public getRange(low: ObjectType, high: ObjectType): [PropertyType, string][] {
    return this.values.getRange(
      this._getIndexValue(low),
      this._getIndexValue(high),
    );
  }

  public add(...items: ObjectType[]): void {
    items.map((item) => {
      const recordName = this.superKey.getKey(item);
      const indexValue = this._getIndexValue(item);
      this.values.set(indexValue, recordName);
    });
  }

  public remove(...items: ObjectType[]): void {
    const keys = items.map((item) => this._getIndexValue(item));
    this.values.deleteKeys(keys);
  }

  private _getIndexValue(obj: ObjectType): PropertyType {
    if (obj[this.indexKey.propertyName] == undefined) {
      throw new PersistenceError("index property not found in object");
    }
    return obj[this.indexKey.propertyName];
  }
}

export class GroupedTableIndex<ObjectType, PropertyType>
  implements ITableIndex<ObjectType, PropertyType>
{
  protected values: BTree<PropertyType, Set<string>>;

  public constructor(
    protected indexKey: IndexKey<PropertyType>,
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

  public get(...items: ObjectType[]): Set<string> {
    const lookups = items.map(
      (item) => this.values.get(this._getIndexValue(item)) ?? new Set<string>(),
    );
    let result = new Set<string>();
    result.forEach((val) => (result = new Set([...result, ...val])));
    return result;
  }

  public getRange(
    start: ObjectType,
    end: ObjectType,
  ): [PropertyType, string][] {
    throw new Error("Method not implemented.");
  }

  private _getIndexValue(obj: ObjectType): PropertyType {
    if (obj[this.indexKey.propertyName] == undefined) {
      throw new PersistenceError("index property not found in object");
    }
    return obj[this.indexKey.propertyName];
  }
}

export class IndexedTable<ObjectType> {
  public constructor(
    protected storage: IStorageUtils,
    protected schema: TableInfo<ObjectType>,
  ) {
    this._loadIndex();
  }

  private _loadIndex() {
    throw new Error("Method not implemented.");
  }
}
