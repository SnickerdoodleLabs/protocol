import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST_Query } from "./AST_Query";
import { QueryEvaluator } from "./QueryEvaluator";

export class QueryRepository {

    queryValuator: QueryEvaluator;

    constructor() {
        this.queryValuator = new QueryEvaluator();
    }

    get(cid: IpfsCID, q: AST_Query): SDQL_Return {
        // 1. return value if it's in the cache
        
        // 2. Evaluate and cache, then return

        const val = this.queryValuator.eval(q);

        this.save(cid, q, val)

        return val;

    }

    save(cid: IpfsCID, q: AST_Query, val: SDQL_Return): void {
        // save in cache
    }
}