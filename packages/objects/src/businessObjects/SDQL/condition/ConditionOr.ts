import { SDQL_OperatorName } from "@objects/primitives";
import { AST_BoolExpr } from "../AST_BoolExpr";
import { Operator } from "../Operator";
import { Condition } from "./Condition";

export class ConditionOr extends Condition {

    constructor(
        name: SDQL_OperatorName,
        readonly lval: AST_BoolExpr | boolean,
        readonly rval: AST_BoolExpr | boolean
    ) {
        super(name);
    }

    // public result(): boolean{
    //     return (this.lval || this.rval);
    // }

}