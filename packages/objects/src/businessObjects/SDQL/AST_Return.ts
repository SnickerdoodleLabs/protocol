import { SDQL_Name } from "@objects/primitives";

export class AST_Return {
    constructor(
        readonly name: SDQL_Name,
        readonly message: string, // TODO
    ) { }
}