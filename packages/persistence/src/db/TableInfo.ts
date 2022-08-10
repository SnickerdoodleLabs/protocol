import { join } from "path";

import { PersistenceError } from "@snickerdoodlelabs/objects";

export enum EIndexType {
  ORDERED = 0,
  GROUPED = 1,
}

export class IndexKey {
  public constructor(
    public propertyName: string,
    public indexingType: EIndexType,
    public comparator?: (a: any, b: any) => number,
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
