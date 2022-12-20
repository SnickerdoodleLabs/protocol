
import { Brand, make } from "ts-brand";

// SolanaAccountAddress is Base58 encoded
export type SolanaTransactionSignature = Brand<
  string,
  "SolanaTransactionSignature"
>;
export const SolanaTransactionSignature = make<SolanaTransactionSignature>();
