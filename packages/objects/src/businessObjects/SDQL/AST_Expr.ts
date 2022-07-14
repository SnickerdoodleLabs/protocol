import { SDQL_Name } from "@objects/primitives";
import { Command_IF } from "./Command_IF";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition/Condition";
import { AST_Return } from "./AST_Return";

export class AST_Expr {
    /**
     * Evaluates to a value.
     * @remarks
     * This is the base class for all the expressions that resolves to a value including queries
     */
    public value: any;
    constructor(
        readonly name: SDQL_Name,
        readonly source: Command_IF | AST_Query | AST_Return | Condition | boolean | number | string

    ) { }

}