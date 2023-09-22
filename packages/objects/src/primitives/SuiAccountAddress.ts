import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SuiAccountAddress = Brand<string, "SuiAccountAddress">;
export const SuiAccountAddress = make<SuiAccountAddress>();
