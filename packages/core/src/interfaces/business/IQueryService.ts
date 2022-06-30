import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentContractRepositoryError,
  EthereumContractAddress,
  IpfsCID,
  UninitializedError,
  IPFSError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  onQueryPosted(
    consentContractAddress: EthereumContractAddress,
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
  ): ResultAsync<void, IPFSError | UninitializedError | ConsentError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
