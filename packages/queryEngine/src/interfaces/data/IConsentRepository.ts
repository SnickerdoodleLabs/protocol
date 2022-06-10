import { EthereumContractAddress } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { ConsentToken } from "@query-engine/interfaces/objects";

export interface IConsentRepository {
    getByContractAddresses(addresses: EthereumContractAddress[]): ResultAsync<Map<EthereumContractAddress, ConsentToken>, never>;
    getByContractAddress(addresses: EthereumContractAddress): ResultAsync<Map<EthereumContractAddress, ConsentToken>, never>;

}

export const IConsentRepositoryType = Symbol.for("IConsentRepository");