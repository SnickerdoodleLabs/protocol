import {
  AdKey,
  CompensationId,
  DuplicateIdInSchema,
  InsightKey,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryUtils {
  getEligibleCompensations(
    schemaString: SDQLString,
    ads: AdKey[],
    insights: InsightKey[],
  ): ResultAsync<
    CompensationId[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;
}

export const ISDQLQueryUtilsType = Symbol.for("ISDQLQueryUtils");
