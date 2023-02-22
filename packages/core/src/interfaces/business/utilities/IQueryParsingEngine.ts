import {
  DataPermissions,
  EligibleReward,
  ExpectedReward,
  EvaluationError,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier,
  IDynamicRewardParameter,
  EVMContractAddress,
  IInsights,
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
    [IInsights, EligibleReward[]],
    EvaluationError | QueryFormatError
  >;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
