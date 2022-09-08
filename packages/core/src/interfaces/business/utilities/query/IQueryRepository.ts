import {
  IpfsCID,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { AST_Query } from "@core/interfaces/objects/index.js";

export interface IQueryRepository {
  get(cid: IpfsCID, q: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");
