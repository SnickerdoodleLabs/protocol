import {
  EligibleReward,
  QueryExpiredError,
  ServerRewardError,
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
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryCID: IpfsCID,
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
  >;

  processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters?: IDynamicRewardParameter[],
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
