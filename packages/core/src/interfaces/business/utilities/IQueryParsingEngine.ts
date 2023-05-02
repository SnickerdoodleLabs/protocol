import {
  DataPermissions,
  EvaluationError,
  EVMContractAddress,
  ExpectedReward,
  IInsights,
  ParserError,
  PossibleReward,
  QueryFormatError,
  SubqueryKey,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<[SubqueryKey[], ExpectedReward[]], EvaluationError>;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<IInsights, EvaluationError | QueryFormatError>;
  getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
