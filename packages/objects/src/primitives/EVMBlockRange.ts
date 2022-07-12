import { EVMBlockNumber } from "./EVMBlockNumber";

export class EVMBlockRange {
    constructor(
        readonly start: EVMBlockNumber,
        readonly end: EVMBlockNumber
    ) {}
}