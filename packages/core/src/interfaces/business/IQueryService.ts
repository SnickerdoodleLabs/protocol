import {
  AdKey,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMContractAddress,
  IDynamicRewardParameter,
  InsightKey,
  IPFSError,
  ParserError,
  PersistenceError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  RequestForData,
  SDQLQuery,
  ServerRewardError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  initialize(): ResultAsync<void, never>;
  onQueryPosted(
    requestForData: RequestForData,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | QueryFormatError
    | EvaluationError
    | QueryExpiredError
    | ServerRewardError
    | PersistenceError
  >;

  approveQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | PersistenceError
  >;

  returnQueries(): ResultAsync<
    void,
    | PersistenceError
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | EvaluationError
    | QueryFormatError
    | AjaxError
  >;

  getPossibleRewardsFromIPBySDQLQuery(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
