import { SDQL_OperatorName } from "@objects/primitives";
import { AST_BoolExpr } from "../AST_BoolExpr";
import { Condition } from "./Condition";

export class ConditionAnd extends Condition {

    constructor(
        name: SDQL_OperatorName, // and
        readonly lval: AST_BoolExpr,
        readonly rval: AST_BoolExpr
    ) {
        super(name);
    }

    // results will be computed by the AST evaluator
    // public result(): boolean{
    //     return (this.lval && this.rval);
    // }

}