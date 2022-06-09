import { ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class QueryParsingEngine {
  public handleQuery(obj: ISDQLQueryObject): ResultAsync<void, never> {
    return okAsync(undefined);
  }
}
