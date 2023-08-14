import {
  DataPermissions,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";

export interface IQueryRepository {
  get(
    cid: IpfsCID,
    q: AST_SubQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");
