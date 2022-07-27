import { IQueryRepository } from "@core/interfaces/business/utilities";
import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { AST_Query } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_Query";
import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { QueryEvaluator } from "./QueryEvaluator";

@injectable()
export class QueryRepository implements IQueryRepository {

    queryValuator: QueryEvaluator;
    dataWalletPersistence: LocalStoragePersistence;

    constructor(
        // readonly queryValuator: QueryEvaluator
    ) {
        this.dataWalletPersistence = new LocalStoragePersistence();
        this.queryValuator = new QueryEvaluator(this.dataWalletPersistence);
    }

    get(cid: IpfsCID, q: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
        // 1. return value if it's in the cache
        
        // 2. Evaluate and cache, then return

        const val = this.queryValuator.eval(q);

        return this.queryValuator.eval(q).andThen( (returnVal: SDQL_Return) =>
        {
            return okAsync(returnVal);
        }
        )
        //this.save(cid, q, val)
        //return val;

    }

    save(cid: IpfsCID, q: AST_Query, val: SDQL_Return): void {
        // save in cache
    }
}