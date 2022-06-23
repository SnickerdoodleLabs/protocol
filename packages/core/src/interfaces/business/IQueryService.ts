import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
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
  >;
  processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentContractError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
