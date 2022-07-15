import { SDQL_OperatorName } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";

export abstract class Operator {

    readonly rval: number | AST_Expr;

    constructor(
        readonly name: SDQL_OperatorName,
    ) {
        this.rval = 0;

    }
}