import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMContractAddress,
  IDynamicRewardParameter,
  IPFSError,
  PersistenceError,
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
}

export const IQueryServiceType = Symbol.for("IQueryService");
