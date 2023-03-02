import { PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { AST_NetworkQuery } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

import { IQueryTypeEvaluator } from "@core/interfaces/business/utilities/query/IQueryTypeEvaluator";

export interface INetworkQueryEvaluator extends IQueryTypeEvaluator {
  eval(query: AST_NetworkQuery): ResultAsync<SDQL_Return, PersistenceError>;
}

export const INetworkQueryEvaluatorType = Symbol.for("INetworkQueryEvaluator");
