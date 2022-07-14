import { SDQL_OperatorName, SDQL_Return } from "@objects/primitives";
import { AST_BoolExpr } from "../AST_BoolExpr";
import { Operator } from "../Operator";

export class ConditionAnd extends Operator {

    constructor(
        name: SDQL_OperatorName, // and
        readonly lval: AST_BoolExpr | boolean | SDQL_Return,
        readonly rval: AST_BoolExpr | boolean | SDQL_Return
    ) {
        super(name);
    }

    // results will be computed by the AST evaluator
    // public result(): boolean{
    //     return (this.lval && this.rval);
    // }

}