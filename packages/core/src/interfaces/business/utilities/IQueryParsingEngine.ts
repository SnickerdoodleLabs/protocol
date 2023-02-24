import {
  DataPermissions,
  EligibleReward,
  ExpectedReward,
  EvaluationError,
  InsightString,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier,
  IDynamicRewardParameter,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError>;
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
