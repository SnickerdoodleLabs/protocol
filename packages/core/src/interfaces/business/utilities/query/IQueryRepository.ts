import {
  DataPermissions,
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_SubQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryRepository {
  get(
    cid: IpfsCID,
    q: AST_SubQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");
