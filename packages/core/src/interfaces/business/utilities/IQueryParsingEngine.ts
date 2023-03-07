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
  CompensationId,
  ISDQLCompensations,
  ISDQLAd,
  AdKey,
  IpfsCID,
  PossibleReward,
  ParserError,
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
  getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
