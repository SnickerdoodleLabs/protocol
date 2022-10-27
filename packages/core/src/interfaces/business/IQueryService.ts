import { EligibleReward, QueryExpiredError, ServerRewardError } from "@snickerdoodlelabs/objects";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMContractAddress,
  IpfsCID,
  IPFSError,
  QueryFormatError,
  SDQLQuery,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {

  onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<
  void, 
  ConsentContractError 
  | ConsentContractRepositoryError 
  | UninitializedError 
  | BlockchainProviderError 
  | AjaxError 
  | QueryFormatError 
  | EvaluationError 
  | QueryExpiredError
  | ServerRewardError
  >;

  processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  >;
}

export const IQueryServiceType = Symbol.for("IQueryService");
