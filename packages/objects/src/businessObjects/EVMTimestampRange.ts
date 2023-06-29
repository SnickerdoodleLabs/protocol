import { UnixTimestamp } from "@objects/primitives/index.js";

export class EVMTimestampRange {
  constructor(readonly start: UnixTimestamp, readonly end: UnixTimestamp) {}

  static fromString(schema: any): EVMTimestampRange {
    return new EVMTimestampRange(
      UnixTimestamp(Number(schema.start)),
      UnixTimestamp(Number(schema.end)),
    );
  }
}
