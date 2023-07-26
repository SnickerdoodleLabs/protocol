import {
  DataPermissions,
  DuplicateIdInSchema,
  EvaluationError,
  ParserError,
  QueryFormatError,
  SDQLQuery,
  IQueryDeliveryItems,
  QueryExpiredError,
  MissingTokenConstructorError,
  EvalNotImplementedError,
  PersistenceError,
  MissingASTError,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  >;
  parseQuery(
    query: SDQLQuery,
  ): ResultAsync<
    AST,
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
  >;

  constructPossibleRewardsFromQuery(
    query: SDQLQuery,
  ): ResultAsync<
    PossibleReward[],
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
    | PersistenceError
    | EvalNotImplementedError
  >;

  getPossibleQueryDeliveryItems(
    query: SDQLQuery,
  ): ResultAsync<
    IQueryDeliveryItems,
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  >;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
