import { SDQL_Name } from "@objects/primitives";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition";

export class AST_PropertyQuery extends AST_Query {

    /**
     * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
     * @param property - the name of the query from the schema, e.g., "age"
     */
    
    constructor(
        readonly name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "list",
        readonly property: string,
        readonly conditions: Array<Condition>

    ) {
        super(name, returnType);
    }
}