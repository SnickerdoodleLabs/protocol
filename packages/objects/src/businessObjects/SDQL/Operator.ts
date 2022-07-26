import { SDQL_OperatorName } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";

export abstract class Operator {

    constructor(
        readonly name: SDQL_OperatorName,
    ) {
    }
}