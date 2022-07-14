import { SDQL_OperatorName } from "@objects/primitives";
import { AST_BoolExpr } from "../AST_BoolExpr";
import { Operator } from "../Operator";

export class ConditionAnd extends Operator {

    constructor(
        name: SDQL_OperatorName, // and
        readonly lval: AST_BoolExpr | boolean,
        readonly rval: AST_BoolExpr | boolean
    ) {
        super(name);
    }

    // results will be computed by the AST evaluator
    // public result(): boolean{
    //     return (this.lval && this.rval);
    // }

}