import { SDQL_Name } from "@objects/primitives";

export abstract class Command {
    
    constructor(
        readonly name: SDQL_Name
    ) {}
}