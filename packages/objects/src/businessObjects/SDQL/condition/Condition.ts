import { SDQL_OperatorName } from "@objects/primitives";

export abstract class Condition {
    constructor(
        readonly name: SDQL_OperatorName
    ) {}
}