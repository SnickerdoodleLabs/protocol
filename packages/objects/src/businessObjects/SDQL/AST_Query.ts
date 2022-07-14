import { SDQL_Name, SDQL_Return } from "@objects/primitives";
import { AST_Expr } from "./AST_Expr";

export abstract class AST_Query {

    constructor(
        readonly name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "list"
    ) {
        // super(name);
    }
    
    // abstract serialize (): JSON;

}