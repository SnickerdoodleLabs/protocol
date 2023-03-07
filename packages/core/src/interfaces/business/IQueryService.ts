import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  IPFSError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
  ServerRewardError,
  UninitializedError,
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
    parameters: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  >;

  getPossibleRewards(
    queryCid: IpfsCID,
    timeoutSeconds: number,
  ): ResultAsync<PossibleReward[], AjaxError | EvaluationError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
