import { AST_Query, IpfsCID, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryRepository {
    get(cid: IpfsCID, q: AST_Query): ResultAsync<SDQL_Return, PersistenceError>;
}