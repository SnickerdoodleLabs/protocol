import {
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryRepository,
} from "@core/interfaces/business/utilities/index.js";
import { AST_Query } from "@core/interfaces/objects/index.js";

@injectable()
export class QueryRepository implements IQueryRepository {
  // queryValuator: QueryEvaluator;
  // dataWalletPersistence: LocalStoragePersistence;

  constructor(
    // readonly queryValuator: QueryEvaluator
    @inject(IQueryEvaluatorType)
    readonly queryValuator: IQueryEvaluator,
  ) {
    // this.dataWalletPersistence = new LocalStoragePersistence();
    // this.queryValuator = new QueryEvaluator(this.dataWalletPersistence);
  }

  get(cid: IpfsCID, q: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
    // 1. return value if it's in the cache

    // 2. Evaluate and cache, then return

    // return okAsync(SDQL_Return(false));

    const val = this.queryValuator.eval(q);
    return val;
    // console.log("Query repository", q);

    // return this.queryValuator.eval(q).andThen((returnVal: SDQL_Return) => {
    //   return okAsync(returnVal);
    // });
    //this.save(cid, q, val)
    //return val;
  }

  save(cid: IpfsCID, q: AST_Query, val: SDQL_Return): void {
    // save in cache
  }
}
