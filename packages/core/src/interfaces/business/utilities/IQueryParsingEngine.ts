import {
  DataPermissions,
  EligibleReward,
  ExpectedReward,
  EvaluationError,
  QueryExpiredError,
  InsightString,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier
} from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/query-parser";
import { AST_Evaluator } from "@core/implementations/business";
import { SDQL_Return } from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPreviews (
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
  [SDQL_Return[], SDQL_Return[]],
  EvaluationError | QueryFormatError | QueryExpiredError
  >;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  >;

  identifyQueries(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return[], EvaluationError>

  evalCompensations(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return[], EvaluationError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
