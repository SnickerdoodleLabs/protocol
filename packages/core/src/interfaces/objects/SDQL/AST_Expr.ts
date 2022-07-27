import { Command_IF } from "./Command_IF";
import { AST_Query } from "./AST_Query";
import { Operator } from "./Operator";
import { AST_Return } from "./AST_Return";
import { SDQL_Name } from "@snickerdoodlelabs/objects";

export class AST_Expr {
    /**
     * Evaluates to a value.
     * @remarks
     * This is the base class for all the expressions that resolves to a value including queries
     */
    public value: any;
    constructor(
        readonly name: SDQL_Name,
        readonly source: Command_IF | AST_Query | AST_Return | Operator | boolean | number | string

    ) { }

}