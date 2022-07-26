import { SDQL_Name } from "@objects/primitives";

export class AST_Return {
    /**
     * 
     * @param name - the name from schema, (key is the name of the parent expression)
     * @param message 
     */
    constructor(
        readonly name: SDQL_Name,
        readonly message: string, // TODO
    ) { }
}