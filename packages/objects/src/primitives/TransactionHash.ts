import { EVMTransactionHash } from "@objects/primitives/EVMTransactionHash.js";
import { SolanaTransactionSignature } from "@objects/primitives/SolanaTransactionSignature.js";

export type TransactionHash = EVMTransactionHash | SolanaTransactionSignature;
