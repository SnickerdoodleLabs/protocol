import { EVMTransaction } from "@snickerdoodlelabs/objects";

export interface IEVMTransactionNormalizer {
  normalize(transaction: EVMTransaction): void;
}

export const IEVMTransactionNormalizerType = Symbol.for(
  "IEVMTransactionNormalizer",
);
