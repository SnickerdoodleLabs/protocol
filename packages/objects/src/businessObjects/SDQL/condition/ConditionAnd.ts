import { SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";

export class ConditionAnd extends Condition {

    constructor(
        name: SDQL_OperatorName, // and
        readonly lval: boolean,
        readonly rval: boolean
    ) {
        super(name);
    }

    public result(): boolean{
        return (this.lval && this.rval);
    }

}