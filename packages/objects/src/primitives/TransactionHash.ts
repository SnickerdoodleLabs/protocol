import { EVMTransactionHash } from "@objects/primitives/EVMTransactionHash.js";
import { SolanaTransactionSignature } from "@objects/primitives/SolanaTransactionSignature.js";
import { SuiTransactionDigest } from "@objects/primitives/SuiTransactionDigest.js";

export type TransactionHash =
  | EVMTransactionHash
  | SolanaTransactionSignature
  | SuiTransactionDigest;
