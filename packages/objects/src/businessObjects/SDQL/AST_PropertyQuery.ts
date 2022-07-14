import { EVMChainCode, SDQL_Name, SDQL_Return } from "@objects/primitives";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition/Condition";

export class AST_PropertyQuery extends AST_Query {
    
    constructor(
        readonly name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "list",
        readonly property: string,
        readonly conditions: Array<Condition>

    ) {
        super(name, returnType);
    }
}