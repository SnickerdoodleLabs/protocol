import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SolanaAccountAddress = Brand<string, "SolanaAccountAddress">;
export const SolanaAccountAddress = make<SolanaAccountAddress>();
