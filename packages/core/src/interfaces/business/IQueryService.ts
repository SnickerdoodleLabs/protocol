import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentContractRepositoryError,
  EthereumContractAddress,
  IpfsCID,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  onQueryPosted(
    consentContractAddress: EthereumContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  >;
  processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
