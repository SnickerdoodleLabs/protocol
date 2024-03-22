import { QuantizedTableId } from "@objects/primitives";

export class QuantizedTable {
  protected _table;
  protected _id;
  public constructor(name: QuantizedTableId, data: number[][]) {
    this._table = data;
    this._id = name;
  }

  id(): QuantizedTableId {
    return this._id;
  }

  table(): number[][] {
    return this._table;
  }
}
