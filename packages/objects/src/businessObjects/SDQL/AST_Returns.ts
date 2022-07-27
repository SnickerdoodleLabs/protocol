import { SDQL_Name, URLString } from "@objects/primitives";
import { AST_ReturnExpr } from "./AST_ReturnExpr";

export class AST_Returns extends Map<SDQL_Name, any>{

    expressions: Map<SDQL_Name, AST_ReturnExpr> = new Map();

    constructor(
        readonly url: URLString
    ) {
        super()
    }

    // get returns(): Array<AST_Return> {
    //     return [] // TODO
    // }

    // set returns(returns: Array<AST_Return>) {
    //     for (let r of returns) {
    //         this._returns.set(r.name, r)
    //     }

    // }


    
}