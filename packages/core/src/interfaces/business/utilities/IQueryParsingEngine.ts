import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  QueryExpiredError,
  InsightString,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier,
  IDynamicRewardParameter,
  CompensationKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedCompIds(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [QueryIdentifier[], CompensationKey[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  >;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  >;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
