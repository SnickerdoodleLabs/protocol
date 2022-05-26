import { Brand, make } from "ts-brand";

export type EthereumAccountAddress = Brand<string, "EthereumAccountAddress">;
export const EthereumAccountAddress = make<EthereumAccountAddress>();
