import { Brand, make } from "ts-brand";

// Solana's private keys are Base58 encoded
export type SolanaPrivateKey = Brand<string, "SolanaPrivateKey">;
export const SolanaPrivateKey = make<SolanaPrivateKey>();
