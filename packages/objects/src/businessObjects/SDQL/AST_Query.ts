import { SDQL_Name, SDQL_Return } from "@objects/primitives";

export abstract class AST_Query {

    constructor(
        readonly name: SDQL_Name,
        readonly returnType: SDQL_Return,
    ) {}
    
    // abstract serialize (): JSON;

}