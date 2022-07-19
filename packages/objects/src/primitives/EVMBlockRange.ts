import { EVMBlockNumber } from "./EVMBlockNumber";

export class EVMBlockRange {
    constructor(
        readonly start: EVMBlockNumber,
        readonly end: EVMBlockNumber
    ) {}

    static fromString(schema: any): EVMBlockRange {
        return new EVMBlockRange(
            EVMBlockNumber(Number(schema.start)),
            EVMBlockNumber(Number(schema.end))
        )
    }
}