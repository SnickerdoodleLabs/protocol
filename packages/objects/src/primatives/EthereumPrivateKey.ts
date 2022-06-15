import { Brand, make } from "ts-brand";

export type EthereumPrivateKey = Brand<string, "EthereumPrivateKey">;
export const EthereumPrivateKey = make<EthereumPrivateKey>();
