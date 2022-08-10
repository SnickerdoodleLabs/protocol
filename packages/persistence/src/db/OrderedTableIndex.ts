import { IFilter, PersistenceError } from "@snickerdoodlelabs/objects";
import * as serialijse from "serialijse";
import BTree, { IMap } from "sorted-btree";

import { IndexKey, SuperKey, EIndexType } from "@persistence/db";
import { ResultAsync } from "neverthrow";

export class OrderedTableIndex<ObjectType, PropertyType = any> {
  protected values: BTree<PropertyType, Set<string>>;

  public constructor(
    protected indexKey: IndexKey,
    protected superKey: SuperKey<ObjectType>,
    comparator?: (a: any, b: any) => number,
    defaults?: ObjectType[],
  ) {
    this.values = new BTree(undefined, comparator);
    if (defaults != undefined) {
      this.add(...defaults);
    }
  }

  public getType(): EIndexType {
    return this.indexKey.indexingType;
  }

  public get(...items: PropertyType[]): Set<string> {
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
    low: PropertyType,
    high: PropertyType,
  ): [PropertyType, Set<string>][] {
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

  private _getIndexValue(obj: ObjectType): PropertyType {
    if (obj[this.indexKey.propertyName] == undefined) {
      throw new PersistenceError("index property not found in object");
    }
    return obj[this.indexKey.propertyName] as PropertyType;
  }

  public getIterator(
    reversed?: boolean,
  ): IterableIterator<[PropertyType, Set<string>]> {
    if (reversed) {
      return this.values.entriesReversed();
    }
    return this.values.entries();
  }

  public getHistogram(): IMap<PropertyType, number> {
    return this.values.mapValues((v, _) => v.size);
  }
}
serialijse.declarePersistable(OrderedTableIndex);
