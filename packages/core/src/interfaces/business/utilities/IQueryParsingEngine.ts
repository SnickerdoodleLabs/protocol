import {
  DataPermissions,
  EligibleReward,
  ExpectedReward,
  EvaluationError,
  QueryExpiredError,
  InsightString,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier,
  SDQL_Return,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business/index.js";

export interface IQueryParsingEngine {
  getPreviews(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [QueryIdentifier[], ExpectedReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  >;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: string[],
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  >;

  identifyQueries(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return[], EvaluationError>;

  evalCompensations(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return[], EvaluationError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
