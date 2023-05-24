import {
  DataPermissions,
  EvaluationError,
  EVMContractAddress,
  ExpectedReward,
  ParserError,
  PossibleReward,
  QueryFormatError,
  SubQueryKey,
  SDQLQuery,
  IQueryDeliveryItems,
} from "@snickerdoodlelabs/objects";
import { AST, SDQLParser } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<IQueryDeliveryItems , EvaluationError | QueryFormatError>;
  parseQuery(
    query: SDQLQuery,
  ): ResultAsync<AST, ParserError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
