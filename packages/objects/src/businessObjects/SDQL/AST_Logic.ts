import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";
import { Command } from "./Command";

export class AST_Logic{
    /**
     * logic has returns and compensations
     */

    constructor(
        readonly returns: Map<string, AST_Expr | Command>,
        readonly compensations: Map<string, AST_Expr | Command>,
    ) {


    }


    
    
}