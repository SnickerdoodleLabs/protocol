import { AST_Query } from "@core/interfaces/objects";
import { IpfsCID, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryRepository {
    get(cid: IpfsCID, q: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
}

export const IQueryRepositoryType = Symbol.for("IQueryRepository");