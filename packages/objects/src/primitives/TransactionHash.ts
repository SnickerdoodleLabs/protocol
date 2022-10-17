import { Brand, make } from "ts-brand";

// SOL
export type SolanaTransactionSignature = Brand<
  string,
  "SolanaTransactionSignature"
>;
export const SolanaTransactionSignature = make<SolanaTransactionSignature>();

// EVM
export type EVMTransactionHash = Brand<string, "EVMTransactionHash">;
export const EVMTransactionHash = make<EVMTransactionHash>();

export type TransactionHash = EVMTransactionHash | SolanaTransactionSignature;
