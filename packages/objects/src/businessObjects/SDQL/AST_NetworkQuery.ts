import { EVMChainCode, SDQL_Name, SDQL_Return } from "@objects/primitives";
import { AST_Contract } from "./AST_Contract";
import { AST_Query } from "./AST_Query";

export class AST_NetworkQuery extends AST_Query{
    constructor(
        name: SDQL_Name,
        readonly returnType: "string" | "boolean" | "integer" | "number" | "list",
        readonly chain: EVMChainCode,
        readonly contract: AST_Contract,

    ) {
        super(name, returnType);
    }
}