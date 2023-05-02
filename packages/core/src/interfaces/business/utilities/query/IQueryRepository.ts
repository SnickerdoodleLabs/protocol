import {
  DataPermissions,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_Subquery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryRepository {
  get(
    q: AST_Subquery,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");
