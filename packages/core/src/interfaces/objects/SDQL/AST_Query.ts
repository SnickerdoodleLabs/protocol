import { SDQL_Name } from "@snickerdoodlelabs/objects";

export abstract class AST_Query {

    constructor(
        readonly name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "list" | "object" | "enum"
    ) {
        // super(name);
    }
    
    // abstract serialize (): JSON;


}