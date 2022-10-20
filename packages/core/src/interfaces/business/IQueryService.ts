import { EligibleReward, QueryExpiredError } from "@snickerdoodlelabs/objects";
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

  processRewardsPreview(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    rewardsPreview: EligibleReward[] | null
  ): ResultAsync<
    boolean,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  >


}

export const IQueryServiceType = Symbol.for("IQueryService");
