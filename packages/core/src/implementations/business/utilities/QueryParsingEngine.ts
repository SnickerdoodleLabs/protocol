import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities";

export class QueryParsingEngine implements IQueryParsingEngine {
  public handleQuery(obj: ISDQLQueryObject): ResultAsync<Insight[], never> {
    return okAsync([]);
  }
}
