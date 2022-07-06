import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import { QueryFormatError } from "@snickerdoodlelabs/objects";

export interface IQueryParsingEngine {
  handleQuery(obj: ISDQLQueryObject, cid: IpfsCID): ResultAsync<Insight[], never | QueryFormatError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
