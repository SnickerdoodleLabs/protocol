import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  InsightKey,
  IpfsCID,
  MissingTokenConstructorError,
  ParserError,
  PossibleReward,
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
    CompensationKey[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;

  filterCompensationsForPreviews(
    schemaString: SDQLString,
    activeCompensationKeys: CompensationKey[],
    possibleInsightsAndAds: (InsightKey | AdKey)[],
  ): ResultAsync<
    PossibleReward[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;
}

export const ISDQLQueryUtilsType = Symbol.for("ISDQLQueryUtils");
