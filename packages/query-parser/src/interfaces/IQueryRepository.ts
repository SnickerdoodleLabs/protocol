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
import { ResultAsync } from "neverthrow";

import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";

export interface IQueryRepository {
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
  >;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");
