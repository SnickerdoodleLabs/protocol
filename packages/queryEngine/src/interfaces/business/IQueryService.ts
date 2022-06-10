import {
  ConsentError,
  EthereumContractAddress,
  IpfsCID,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  onQueryPosted(
    contractAddress: EthereumContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<void, never>;
  processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentError>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
