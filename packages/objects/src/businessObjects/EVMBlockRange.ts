import { EVMBlockNumber } from "@objects/primitives";
import { UnixTimestamp } from "@objects/primitives";

export class EVMBlockRange {
    constructor(
        readonly start: UnixTimestamp,
        readonly end: UnixTimestamp
    ) {}

    static fromString(schema: any): EVMBlockRange {
        return new EVMBlockRange(
            UnixTimestamp(Number(schema.start)),
            UnixTimestamp(Number(schema.end))
        )
    }
}
