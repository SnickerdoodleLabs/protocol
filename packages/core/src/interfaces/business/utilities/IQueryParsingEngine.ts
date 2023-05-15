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
import { ResultAsync } from "neverthrow";

export interface IQueryParsingEngine {
  getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<[SubQueryKey[], ExpectedReward[]], EvaluationError>;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<IQueryDeliveryItems, EvaluationError | QueryFormatError>;
  getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError>;
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
