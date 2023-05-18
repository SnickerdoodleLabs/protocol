import {
  DataPermissions,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_SubQuery, IQueryRepository } from "@snickerdoodlelabs/query-parser";
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
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.isSubQueryPermitted(q, dataPermissions)
      ? this.queryValuator.eval(q)
      : okAsync(SDQL_Return(null));
  }

  private isSubQueryPermitted(
    q: AST_SubQuery,
    dataPermissions: DataPermissions,
  ): boolean {
    const flag = q.getPermission();
    return flag.isOk() && dataPermissions.getFlag(flag.value);
  }
}
