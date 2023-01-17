import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  InsightString,
  QueryFormatError,
  SDQLQuery,
  QueryIdentifier,
  IDynamicRewardParameter,
  EVMContractAddress,
  CompensationKey,
  QueryExpiredError
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";


export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedCompKeys(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress
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
