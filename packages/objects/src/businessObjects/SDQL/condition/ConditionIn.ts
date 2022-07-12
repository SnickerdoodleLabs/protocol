import { SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";

export class ConditionIn extends Condition {

    constructor(
        name: SDQL_OperatorName,
        readonly rval: number
    ) {
        super(name);
    }

}