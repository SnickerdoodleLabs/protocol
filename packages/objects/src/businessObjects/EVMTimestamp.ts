import { EVMBlockNumber, UnixTimestamp } from "@objects/primitives";

export class EVMTimestamp {
  constructor(readonly start: UnixTimestamp, readonly end: UnixTimestamp) {}

  static fromString(schema: any): EVMTimestamp {
    return new EVMTimestamp(
      UnixTimestamp(Number(schema.start)),
      UnixTimestamp(Number(schema.end)),
    );
  }
}
