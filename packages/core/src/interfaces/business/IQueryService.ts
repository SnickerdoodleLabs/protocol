import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError, ConsentContractRepositoryError, ConsentError, EvaluationError, EVMContractAddress,
  IpfsCID, IPFSError, QueryFormatError, SDQLQuery, UninitializedError
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
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery
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
