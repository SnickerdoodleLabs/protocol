import { SDQL_Name, URLString } from "@objects/primitives";
import { AST_Return } from "./AST_Return";

export class AST_Returns extends Map<SDQL_Name, any>{
    
    private _returns: Map<SDQL_Name, AST_Return>;

    constructor(
        readonly url: URLString
    ) {
        super()
        this._returns = new Map<SDQL_Name, AST_Return>();
    }

    get returns(): Array<AST_Return> {
        return [] // TODO
    }

    set returns(returns: Array<AST_Return>) {
        for (let r of returns) {
            this._returns.set(r.name, r)
        }

    }


    
}