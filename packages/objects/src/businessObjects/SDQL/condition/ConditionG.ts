import { SDQL_OperatorName } from "@objects/primitives";
import { AST_Expr } from "../AST_Expr";
import { Condition } from "./Condition";


export class ConditionG extends Condition {

    constructor(
        name: SDQL_OperatorName, // ge - greater and equal then
        readonly lval: null | number | AST_Expr,
        readonly rval: number | AST_Expr,
    ) {
        super(name);
    }
    check(): boolean {
        // TODO
        return true;
    }
}