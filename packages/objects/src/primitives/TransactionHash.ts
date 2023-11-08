import { EVMTransactionHash } from "@objects/primitives/EVMTransactionHash.js";
import { SolanaTransactionSignature } from "@objects/primitives/SolanaTransactionSignature.js";
import { SuiTransactionHash } from "@objects/primitives/SuiTransactionHash.js";

export type TransactionHash =
  | EVMTransactionHash
  | SolanaTransactionSignature
  | SuiTransactionHash;
