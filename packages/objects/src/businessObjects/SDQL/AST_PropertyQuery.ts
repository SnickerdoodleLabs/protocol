import { EVMChainCode, SDQL_Name, SDQL_Return } from "@objects/primitives";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition/Condition";

class PropertyQuery extends AST_Query {
    
    constructor(
        name: SDQL_Name,
        returnType: SDQL_Return,
        conditions: Array<Condition>

    ) {
        super(name, returnType);
    }
}