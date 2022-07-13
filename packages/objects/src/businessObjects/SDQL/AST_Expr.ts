import { SDQL_Name } from "@objects/primitives";

export class AST_Expr {
    /**
     * Evaluates to a value.
     * @remarks
     * This is the base class for all the expressions that resolves to a value including queries
     */

     constructor(
        readonly name: SDQL_Name,
        readonly expr: AST_Expr

    ) { }

}