import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SolanaTokenAddress = Brand<string, "SolanaTokenAddress">;
export const SolanaTokenAddress = make<SolanaTokenAddress>();
