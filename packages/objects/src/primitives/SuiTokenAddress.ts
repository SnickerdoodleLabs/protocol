import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SuiTokenAddress = Brand<string, "SuiTokenAddress">;
export const SuiTokenAddress = make<SuiTokenAddress>();
