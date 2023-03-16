import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  EVMContractAddress,
  ExpectedReward,
  IDynamicRewardParameter,
  IInsights,
  ParserError,
  PossibleReward,
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
  ): ResultAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError>;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    [IInsights, EligibleReward[]],
    EvaluationError | QueryFormatError
  >;
  getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
