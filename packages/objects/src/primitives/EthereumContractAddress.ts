import { Brand, make } from "ts-brand";

export type EthereumContractAddress = Brand<string, "EthereumContractAddress">;
export const EthereumContractAddress = make<EthereumContractAddress>();
