import { AST_Expr } from "./AST_Expr";
import { AST_Query } from "./AST_Query";

export class AST_Logic{
    /**
     * logic has returns and compensations
     */

    expPermissionMap: Map<AST_Expr, Array<AST_Query>> = new Map();

    constructor(
        readonly returns: Array<AST_Expr>,
        readonly compensations: Array<AST_Expr>,
        queries: Array<AST_Query>
    ) {

        this.createExpPermissionMap(queries);

    }

    createExpPermissionMap(queries: Array<AST_Query>): void {
        
    }

    
    
}