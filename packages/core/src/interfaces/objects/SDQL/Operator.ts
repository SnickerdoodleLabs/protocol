import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

export abstract class Operator {

    constructor(
        readonly name: SDQL_OperatorName,
    ) {
    }
}