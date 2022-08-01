import {
  EvaluationError,
  SDQLQuery,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentContractRepositoryError,
  EVMContractAddress,
  IpfsCID,
  QueryFormatError,
  UninitializedError,
  IPFSError,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<
    void,
    | IPFSError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  >;
  processQuery(
    queryRequest: SDQLQueryRequest
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
