import { SDQL_Name, URLString } from "@objects/primitives";

export class AST_Compensation {
    
    constructor(
        readonly name: SDQL_Name,
        readonly description: string, // TODO
        readonly callback: URLString
    ) {}
}