import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  EvalNotImplementedError,
  EvaluationError,
  InsightKey,
  IpfsCID,
  IQueryDeliveryItems,
  MissingASTError,
  MissingTokenConstructorError,
  ParserError,
  PersistenceError,
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
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
    | EvaluationError
  >;

  filterCompensationsForPreviews(
    queryCID : IpfsCID,
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
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  >;
}

export const ISDQLQueryUtilsType = Symbol.for("ISDQLQueryUtils");
