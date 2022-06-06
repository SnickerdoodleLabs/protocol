import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
    handleQuery(obj: ISDQLQueryObject): ResultAsync<Insight[], never>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
