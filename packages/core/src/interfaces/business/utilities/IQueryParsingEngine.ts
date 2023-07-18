import {
  DataPermissions,
  DuplicateIdInSchema,
  EvaluationError,
  EVMContractAddress,
  ExpectedReward,
  IInsights,
  MissingASTError,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
  ParserError,
  PersistenceError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    [QueryIdentifier[], ExpectedReward[]],
    | EvaluationError
    | PersistenceError
    | QueryFormatError
    | ParserError
    | QueryExpiredError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
  >;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsights,
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | PersistenceError
  >;
  getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<
    PossibleReward[],
    | ParserError
    | QueryFormatError
    | QueryExpiredError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
  >;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
