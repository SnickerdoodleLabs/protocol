import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  InsightKey,
  IpfsCID,
  IQueryDeliveryItems,
  MissingTokenConstructorError,
  ParserError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryUtils {
  getCompensationsToDispense(
    schemaString: SDQLString,
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<
    CompensationKey[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > 

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
