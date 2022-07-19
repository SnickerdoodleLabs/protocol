import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST_Query } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_Query";
import { QueryEvaluator } from "./QueryEvaluator";
import { IDataWalletPersistence } from "@snickerdoodlelabs/objects";
import { DefaultDataWalletPersistence } from "@core/implementations/data";
import { LocalStoragePersistence } from "@persistence/LocalStoragePersistence";

export class QueryRepository {

    queryValuator: QueryEvaluator;
    dataWalletPersistence: LocalStoragePersistence;

    constructor() {
        this.dataWalletPersistence = new LocalStoragePersistence();
        this.queryValuator = new QueryEvaluator(this.dataWalletPersistence);
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