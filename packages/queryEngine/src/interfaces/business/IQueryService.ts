import { EthereumContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
    onQueryPosted(contractAddress: EthereumContractAddress, queryId: IpfsCID): ResultAsync<void, never>;
    processQuery(queryId: IpfsCID): ResultAsync<void, Error>;
}

export const IQueryServiceType = Symbol.for("IQueryService");
