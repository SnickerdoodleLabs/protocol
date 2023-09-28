import { IpfsCID, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_SubQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryTypeEvaluator {
  eval(query: AST_SubQuery ,   queryCID : IpfsCID): ResultAsync<SDQL_Return, PersistenceError>;
}
