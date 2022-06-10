import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IQueryParsingEngine } from "@query-engine/interfaces/business/utilities";

export class QueryParsingEngine implements IQueryParsingEngine {
  public handleQuery(obj: ISDQLQueryObject): ResultAsync<Insight[], never> {
    return okAsync([]);
  }
}
