import {
  EVMTransactionHash,
  SolanaTransactionSignature,
} from "@objects/primitives";

export type TransactionHash = EVMTransactionHash | SolanaTransactionSignature;
