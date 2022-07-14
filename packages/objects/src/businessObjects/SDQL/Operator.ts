import { SDQL_OperatorName } from "@objects/primitives";

export abstract class Operator {
    constructor(
        readonly name: SDQL_OperatorName
    ) {}
}