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
  PublicEvents,
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  MethodSupportError,
} from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
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

  constructAllTheRewardsFromQuery(
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
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  >;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
