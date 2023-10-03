import { Brand, make } from "ts-brand";

// Solana's private keys are Base58 encoded
export type SuiPrivateKey = Brand<string, "SuiPrivateKey">;
export const SuiPrivateKey = make<SuiPrivateKey>();
