import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentContractRepositoryError,
  EVMContractAddress,
  IpfsCID,
  UninitializedError,
  IPFSError,
  QueryFormatError,
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
    queryId: IpfsCID,
  ): ResultAsync<void, AjaxError | UninitializedError | ConsentError | IPFSError | QueryFormatError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
