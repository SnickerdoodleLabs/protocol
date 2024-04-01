import {
  AccountIndexingError,
  AjaxError,
  DataPermissions,
  InvalidParametersError,
  IpfsCID,
  MethodSupportError,
  PersistenceError,
  SDQL_Return,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  AST_SubQuery,
  IQueryRepository,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IQueryEvaluator,
  IQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/index.js";

@injectable()
export class QueryRepository implements IQueryRepository {
  constructor(
    @inject(IQueryEvaluatorType)
    readonly queryValuator: IQueryEvaluator,
  ) {}

  get(
    cid: IpfsCID,
    q: AST_SubQuery,
    dataPermissions: DataPermissions,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<
    SDQL_Return,
    | PersistenceError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.isSubQueryPermitted(q, dataPermissions, cid)
      ? this.queryValuator.eval(q, cid, queryTimestamp)
      : okAsync(SDQL_Return(null));
  }

  private isSubQueryPermitted(
    q: AST_SubQuery,
  ): boolean {
    return q.getPermission();
  }
}
