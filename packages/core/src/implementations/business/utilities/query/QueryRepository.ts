import {
  DataPermissions,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_Subquery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryRepository,
} from "@core/interfaces/business/utilities/query/index.js";

@injectable()
export class QueryRepository implements IQueryRepository {
  constructor(
    @inject(IQueryEvaluatorType)
    readonly queryValuator: IQueryEvaluator,
  ) {}

  get(
    q: AST_Subquery,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.isSubqueryPermitted(q, dataPermissions)
      ? this.queryValuator.eval(q)
      : okAsync(SDQL_Return(false));
  }

  private isSubqueryPermitted(
    q: AST_Subquery,
    dataPermissions: DataPermissions,
  ): boolean {
    const flag = q.getPermission();
    return flag.isOk() && dataPermissions.getFlag(flag.value);
  }
}
