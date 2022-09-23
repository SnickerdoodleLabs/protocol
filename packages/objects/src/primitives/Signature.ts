import { Brand, make } from "ts-brand";

// Solana signatures are 64 bytes (128 hex chars)
// Ethereum signatures are 65 bytes (130 hex chars)
export type Signature = Brand<string, "Signature">;
export const Signature = make<Signature>();
