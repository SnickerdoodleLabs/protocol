import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SuiAccountAddress = Brand<string, "SuiAccountAddress">;
export const SuiAccountAddress = make<SuiAccountAddress>();

export const SuiAccountAddressRegex = /^0x[a-fA-F0-9]{40}$/;
